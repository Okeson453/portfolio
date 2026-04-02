import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');

    // ─── Create roles ────────────────────────────────────
    const admin = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            name: 'admin',
            description: 'Full system access',
        },
    });

    const moderator = await prisma.role.upsert({
        where: { name: 'moderator' },
        update: {},
        create: {
            name: 'moderator',
            description: 'Content and user moderation',
        },
    });

    const author = await prisma.role.upsert({
        where: { name: 'author' },
        update: {},
        create: {
            name: 'author',
            description: 'Blog post authoring',
        },
    });

    const viewer = await prisma.role.upsert({
        where: { name: 'viewer' },
        update: {},
        create: {
            name: 'viewer',
            description: 'View public content',
        },
    });

    console.log('✓ Roles created');

    // ─── Create permissions ──────────────────────────────
    const permissions = [
        'users:read',
        'users:write',
        'blog:read',
        'blog:write',
        'blog:publish',
        'comments:moderate',
        'analytics:read',
        'settings:write',
    ];

    const permissionRecords = await Promise.all(
        permissions.map((name) =>
            prisma.permission.upsert({
                where: { name },
                update: {},
                create: { name },
            })
        )
    );

    console.log('✓ Permissions created');

    // ─── Assign permissions to roles ─────────────────────
    // Admin gets all permissions
    await Promise.all(
        permissionRecords.map((perm) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: admin.id,
                        permissionId: perm.id,
                    },
                },
                update: {},
                create: {
                    roleId: admin.id,
                    permissionId: perm.id,
                },
            })
        )
    );

    // Moderator: comments:moderate, blog:read, users:read
    const moderatorPerms = permissionRecords.filter((p) =>
        ['comments:moderate', 'blog:read', 'users:read'].includes(p.name)
    );
    await Promise.all(
        moderatorPerms.map((perm) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: moderator.id,
                        permissionId: perm.id,
                    },
                },
                update: {},
                create: {
                    roleId: moderator.id,
                    permissionId: perm.id,
                },
            })
        )
    );

    // Author: blog:read, blog:write
    const authorPerms = permissionRecords.filter((p) =>
        ['blog:read', 'blog:write'].includes(p.name)
    );
    await Promise.all(
        authorPerms.map((perm) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: author.id,
                        permissionId: perm.id,
                    },
                },
                update: {},
                create: {
                    roleId: author.id,
                    permissionId: perm.id,
                },
            })
        )
    );

    // Viewer: blog:read, analytics:read
    const viewerPerms = permissionRecords.filter((p) =>
        ['blog:read', 'analytics:read'].includes(p.name)
    );
    await Promise.all(
        viewerPerms.map((perm) =>
            prisma.rolePermission.upsert({
                where: {
                    roleId_permissionId: {
                        roleId: viewer.id,
                        permissionId: perm.id,
                    },
                },
                update: {},
                create: {
                    roleId: viewer.id,
                    permissionId: perm.id,
                },
            })
        )
    );

    console.log('✓ Role permissions assigned');

    // ─── Create default admin user ───────────────────────
    const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@securestack.local' },
        update: {},
        create: {
            email: 'admin@securestack.local',
            passwordHash: adminPasswordHash,
            name: 'Admin User',
            emailVerified: new Date(),
        },
    });

    // Assign admin role to admin user
    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: adminUser.id,
                roleId: admin.id,
            },
        },
        update: {},
        create: {
            userId: adminUser.id,
            roleId: admin.id,
        },
    });

    console.log('✓ Admin user created');

    // ─── Create sample blog posts ────────────────────────
    const post1 = await prisma.blogPost.upsert({
        where: { slug: 'zero-day-vulnerabilities' },
        update: {},
        create: {
            slug: 'zero-day-vulnerabilities',
            title: 'Understanding Zero-Day Vulnerabilities',
            excerpt:
                'A comprehensive guide to identifying, analyzing, and responding to zero-day exploits in modern systems.',
            content: `# Understanding Zero-Day Vulnerabilities

Zero-day vulnerabilities represent some of the most critical security threats in modern computing. This article explores the anatomy of zero-day exploits, detection techniques, and mitigation strategies.

## What is a Zero-Day?

A zero-day vulnerability is a software vulnerability that is unknown to the vendor or public. The term "zero-day" refers to the fact that the developers have had zero days to patch the vulnerability.

## Detection and Analysis

Several approaches can help identify potential zero-day vulnerabilities:

1. **Behavioral Analysis** - Monitor for unusual system behavior
2. **Network Traffic Analysis** - Look for suspicious patterns
3. **Vulnerability Scanning** - Use advanced scanning tools
4. **Threat Intelligence** - Track emerging threats

## Mitigation Strategies

Protecting against zero-day attacks requires a multi-layered approach:

- Keep systems and software updated
- Implement robust monitoring and logging
- Use defense-in-depth principles
- Maintain incident response procedures

`,
            coverImage: 'https://images.unsplash.com/photo-1555949519-51caa50df60c?w=1200',
            tags: ['security', 'vulnerabilities', 'penetesting'],
            status: 'published',
            publishedAt: new Date(),
        },
    });

    const post2 = await prisma.blogPost.upsert({
        where: { slug: 'securing-apis' },
        update: {},
        create: {
            slug: 'securing-apis',
            title: 'Best Practices for API Security',
            excerpt:
                'Protecting your APIs from common attacks: from authentication to rate limiting and everything in between.',
            content: `# Best Practices for API Security

APIs are critical infrastructure in modern applications, making their security paramount. This guide covers essential API security practices.

## Authentication and Authorization

Implement strong authentication mechanisms:

- Use OAuth 2.0 or similar standards
- Implement JWT with short expiration times
- Use HTTPS for all API communications
- Validate API keys server-side

## Rate Limiting and DDoS Protection

Protect your APIs from abuse:

- Implement rate limiting based on IP and user
- Monitor for unusual traffic patterns
- Use WAF (Web Application Firewall)
- Implement circuit breakers for resilience

## Data Protection

Ensure data remains secure:

- Encrypt sensitive data in transit and at rest
- Sanitize and validate all inputs
- Implement proper CORS policies
- Log and monitor all API access

`,
            coverImage: 'https://images.unsplash.com/photo-1526374965328-7f5e00bda549?w=1200',
            tags: ['api', 'security', 'authentication'],
            status: 'published',
            publishedAt: new Date(),
        },
    });

    const post3 = await prisma.blogPost.upsert({
        where: { slug: 'penetration-testing-guide' },
        update: {},
        create: {
            slug: 'penetration-testing-guide',
            title: 'A Beginner\'s Guide to Penetration Testing',
            excerpt:
                'Learn the fundamentals of ethical hacking and pen testing methodologies for security assessments.',
            content: `# A Beginner's Guide to Penetration Testing

Penetration testing is a critical component of any comprehensive security program. This guide introduces beginners to the fundamentals.

## What is Penetration Testing?

Penetration testing (pen testing) is a simulated cyber attack against a system to identify and exploit vulnerabilities. The goal is to help organizations improve their security posture.

## Key Phases

1. **Reconnaissance** - Gather information about the target
2. **Scanning** - Identify open ports and services
3. **Enumeration** - Extract detailed information
4. **Exploitation** - Attempt to exploit found vulnerabilities
5. **Reporting** - Document findings and recommendations

## Tools and Techniques

Common tools used by penetration testers:

- Nmap for network scanning
- Metasploit for exploitation
- Burp Suite for web application testing
- Wireshark for network analysis
- sqlmap for SQL injection testing

## Ethical Considerations

Always remember:

- Get proper authorization before testing
- Follow the rules of engagement
- Protect sensitive data discovered
- Provide detailed and actionable reports

`,
            coverImage: 'https://images.unsplash.com/photo-1514432324607-2e4c00c159c2?w=1200',
            tags: ['pentesting', 'hacking', 'security'],
            status: 'published',
            publishedAt: new Date(),
        },
    });

    console.log('✓ Blog posts created');

    // ─── Create sample projects ──────────────────────────
    await prisma.project.upsert({
        where: { slug: 'vulnerability-scanner' },
        update: {},
        create: {
            slug: 'vulnerability-scanner',
            title: 'Automated Vulnerability Scanner',
            description:
                'A comprehensive tool for identifying security vulnerabilities in web applications using multiple scanning techniques.',
            tech: ['Python', 'Flask', 'Nmap', 'SQLMap'],
            liveUrl: 'https://example.com/scanner',
            repoUrl: 'https://github.com/yourusername/vuln-scanner',
            coverImage: 'https://images.unsplash.com/photo-1551430782-eb63b12cb0d5?w=1200',
            status: 'published',
            featured: true,
        },
    });

    await prisma.project.upsert({
        where: { slug: 'secure-password-manager' },
        update: {},
        create: {
            slug: 'secure-password-manager',
            title: 'Secure Password Manager',
            description:
                'End-to-end encrypted password management system built with modern cryptography principles.',
            tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AES-256'],
            liveUrl: 'https://example.com/password-manager',
            repoUrl: 'https://github.com/yourusername/password-manager',
            coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200',
            status: 'published',
            featured: true,
        },
    });

    console.log('✓ Projects created');

    // ─── Create sample testimonials ──────────────────────
    await prisma.testimonial.upsert({
        where: { id: 'testimonial-1' },
        update: {},
        create: {
            id: 'testimonial-1',
            name: 'John Smith',
            title: 'CTO',
            company: 'Security Corp',
            content:
                'Exceptional security expertise. Their penetration testing reports were thorough and led to significant improvements in our security posture.',
            rating: 5,
            status: 'approved',
        },
    });

    await prisma.testimonial.upsert({
        where: { id: 'testimonial-2' },
        update: {},
        create: {
            id: 'testimonial-2',
            name: 'Sarah Johnson',
            title: 'Security Director',
            company: 'TechStart Inc',
            content:
                'Professional, knowledgeable, and results-focused. Helped us identify and remediate critical vulnerabilities before they became major issues.',
            rating: 5,
            status: 'approved',
        },
    });

    await prisma.testimonial.upsert({
        where: { id: 'testimonial-3' },
        update: {},
        create: {
            id: 'testimonial-3',
            name: 'Michael Chen',
            title: 'Chief Information Security Officer',
            company: 'Enterprise Solutions',
            content:
                'Top-tier security engineer. Their work on our full-stack security architecture was invaluable to our compliance initiatives.',
            rating: 5,
            status: 'approved',
        },
    });

    console.log('✓ Testimonials created');

    // ─── Create default site settings ────────────────────
    await prisma.siteSetting.upsert({
        where: { key: 'siteName' },
        update: { value: 'SecureStack' },
        create: { key: 'siteName', value: 'SecureStack' },
    });

    await prisma.siteSetting.upsert({
        where: { key: 'contactEmail' },
        update: { value: 'contact@securestack.local' },
        create: { key: 'contactEmail', value: 'contact@securestack.local' },
    });

    await prisma.siteSetting.upsert({
        where: { key: 'maintenanceMode' },
        update: { value: 'false' },
        create: { key: 'maintenanceMode', value: 'false' },
    });

    console.log('✓ Site settings created');

    console.log('\n✅ Database seeding completed successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

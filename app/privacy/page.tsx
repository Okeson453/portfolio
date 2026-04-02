import { Metadata } from 'next';

// Static legal page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    title: 'Privacy Policy | SecureStack',
    description: 'Privacy policy for SecureStack portfolio',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                    Privacy Policy
                </h1>

                <div className="prose prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            1. Introduction
                        </h2>
                        <p>
                            SecureStack ("we", "us", "our", or "Company") operates the SecureStack portfolio website.
                            This page informs you of our policies regarding the collection, use, and disclosure of
                            personal data when you use our website and the choices you have associated with that data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            2. Information Collection and Use
                        </h2>
                        <p>
                            We collect several different types of information for various purposes to provide and
                            improve our service to you.
                        </p>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            Types of Data Collected:
                        </h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Personal Data: Name, email address, phone number (when voluntarily provided)</li>
                            <li>Usage Data: Browser type, IP address, pages visited, time spent on pages</li>
                            <li>Cookies and Similar Technologies: Tracking and analytics data</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            3. Use of Data
                        </h2>
                        <p>SecureStack uses the collected data for various purposes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>To provide and maintain our portfolio website</li>
                            <li>To notify you about changes to our website or services</li>
                            <li>To provide customer support</li>
                            <li>To gather analysis or valuable information for website improvement</li>
                            <li>To send promotional communications (with your consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            4. Security of Data
                        </h2>
                        <p>
                            The security of your data is important to us but remember that no method of transmission
                            over the Internet or method of electronic storage is 100% secure. While we strive to use
                            commercially acceptable means to protect your Personal Data, we cannot guarantee its
                            absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            5. Changes to This Privacy Policy
                        </h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes by
                            posting the new Privacy Policy on this page and updating the "effective date" at the top
                            of this Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            6. Contact Us
                        </h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="mt-4">
                            Email: privacy@securestack.dev<br />
                            Website: securestack.dev
                        </p>
                    </section>

                    <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Last updated: February 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

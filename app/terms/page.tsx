import { Metadata } from 'next';

// Static legal page
export const dynamic = 'force-static';
export const revalidate = false;

export const metadata: Metadata = {
    title: 'Terms of Service | SecureStack',
    description: 'Terms of service for SecureStack portfolio',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
                    Terms of Service
                </h1>

                <div className="prose prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            1. Agreement to Terms
                        </h2>
                        <p>
                            By accessing and using the SecureStack portfolio website (the "Website"), you accept and
                            agree to be bound by and comply with these Terms of Service and our Privacy Policy. If you
                            do not agree to abide by the provisions of this Agreement, please do not use this service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            2. Use License
                        </h2>
                        <p>
                            Permission is granted to temporarily download one copy of the materials (information or
                            software) on SecureStack's website for personal, non-commercial transitory viewing only.
                            This is the grant of a license, not a transfer of title, and under this license you may not:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Modify or copy the materials</li>
                            <li>Use the materials for any commercial purpose or for any public display</li>
                            <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                            <li>Remove any copyright or other proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                            <li>Violate any laws or engage in any conduct that restricts others' use of the website</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            3. Disclaimer
                        </h2>
                        <p>
                            The materials on SecureStack's website are provided on an "as is" basis. SecureStack makes
                            no warranties, expressed or implied, and hereby disclaims and negates all other warranties
                            including, without limitation, implied warranties or conditions of merchantability, fitness
                            for a particular purpose, or non-infringement of intellectual property or other violation
                            of rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            4. Limitations
                        </h2>
                        <p>
                            In no event shall SecureStack or its suppliers be liable for any damages (including, without
                            limitation, damages for loss of data or profit, or due to business interruption) arising out
                            of the use or inability to use the materials on SecureStack's website, even if SecureStack
                            or a representative of SecureStack has been notified orally or in writing of the possibility
                            of such damage.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            5. Accuracy of Materials
                        </h2>
                        <p>
                            The materials appearing on SecureStack's website could include technical, typographical, or
                            photographic errors. SecureStack does not warrant that any of the materials on its website
                            are accurate, complete, or current. SecureStack may make changes to the materials contained
                            on its website at any time without notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            6. Links
                        </h2>
                        <p>
                            SecureStack has not reviewed all of the sites linked to its website and is not responsible
                            for the contents of any such linked site. The inclusion of any link does not imply endorsement
                            by SecureStack of the site. Use of any such linked website is at the user's own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            7. Modifications
                        </h2>
                        <p>
                            SecureStack may revise these Terms of Service for its website at any time without notice.
                            By using this website, you are agreeing to be bound by the then current version of these
                            Terms of Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            8. Governing Law
                        </h2>
                        <p>
                            These Terms and Conditions and any separate agreements we may have with you related to the
                            website are governed by and construed in accordance with the laws of the jurisdiction in which
                            the Company is located, and you irrevocably submit to the exclusive jurisdiction of the courts
                            in that location.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            9. Contact Information
                        </h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at:
                        </p>
                        <p className="mt-4">
                            Email: support@securestack.dev<br />
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

import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicyPage() {
   return (
      <div className='min-h-screen bg-[#93E7FF] flex flex-col items-center justify-center p-4'>
         <div className='w-full max-w-4xl bg-white rounded-lg shadow-md py-12 px-8 space-y-8'>
            <div className='text-center'>
               <Image
                  src='/assets/img/logoLarge.png'
                  alt='CarGas Logo'
                  width={200}
                  height={80}
                  className='mx-auto'
               />
               <h1 className='mt-6 text-3xl font-bold text-gray-900'>
                  Privacy Policy
               </h1>
               <p className='mt-2 text-sm text-gray-600'>
                  Last Updated: {new Date().toLocaleDateString()}
               </p>
            </div>

            <div className='space-y-6 text-gray-700'>
               <p>
                  At Car Gas Inc ("Company," "we," "us," or "our"), we are
                  committed to protecting your privacy. This Privacy Policy
                  describes how we collect, use, disclose, and protect your
                  information when you visit our website cargas.io ("Website").
                  By using this Website, you agree to the practices described in
                  this Privacy Policy.
               </p>

               <section>
                  <h2 className='text-xl font-semibold mb-2'>
                     1. Information We Collect
                  </h2>
                  <p>
                     We collect various types of information from and about
                     users of our Website, including:
                  </p>
                  <ul className='list-disc pl-6 mt-2 space-y-1'>
                     <li>
                        Personal Information: Information that identifies you
                        personally, such as your name, email address, and any
                        other information you voluntarily provide when you
                        contact us.
                     </li>
                     <li>
                        Usage Data: Information about your internet connection,
                        the equipment you use to access our Website, and your
                        usage details, including your IP address, browser type,
                        browsing actions, and patterns.
                     </li>
                  </ul>
               </section>

               <section>
                  <h2 className='text-xl font-semibold mb-2'>
                     2. How We Collect Information
                  </h2>
                  <p>We collect information in the following ways:</p>
                  <ul className='list-disc pl-6 mt-2 space-y-1'>
                     <li>
                        Directly from You: When you contact us via the Website,
                        email, or other methods.
                     </li>
                     <li>
                        Automatically: As you navigate through the Website, we
                        use automatic data collection technologies, such as
                        cookies and web beacons, to collect information about
                        your browsing actions and patterns.
                     </li>
                  </ul>
               </section>

               <section>
                  <h2 className='text-xl font-semibold mb-2'>
                     3. Use of Your Information
                  </h2>
                  <p>
                     We may use the information we collect for various purposes,
                     including to:
                  </p>
                  <ul className='list-disc pl-6 mt-2 space-y-1'>
                     <li>Operate, maintain, and improve our Website.</li>
                     <li>Respond to your inquiries, requests, or comments.</li>
                     <li>
                        Understand how users interact with our Website to
                        improve user experience.
                     </li>
                     <li>
                        Enforce our Terms and Conditions and comply with legal
                        obligations.
                     </li>
                  </ul>
               </section>

               {/* Sections 4-10 follow the same pattern */}

               <section>
                  <h2 className='text-xl font-semibold mb-2'>11. Contact Us</h2>
                  <p>
                     If you have any questions about this Privacy Policy or our
                     privacy practices, please contact us at:
                  </p>
                  <p className='mt-2'>
                     Car Gas Inc
                     <br />
                     Email:{" "}
                     <a
                        href='mailto:info@cargas.io'
                        className='text-[#93E7FF] hover:underline'
                     >
                        info@cargas.io
                     </a>
                     <br />
                     Website:{" "}
                     <a
                        href='https://cargas.io'
                        className='text-[#93E7FF] hover:underline'
                     >
                        cargas.io
                     </a>
                  </p>
               </section>
            </div>

            <div className='text-center mt-8'>
               <Link href='/' className='text-[#93E7FF] hover:underline'>
                  Back to Home
               </Link>
            </div>
         </div>
      </div>
   );
}

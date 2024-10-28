import Image from "next/image";
import Link from "next/link";

export default function TermsPage() {
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
                  Terms and Conditions
               </h1>
               <p className='mt-2 text-sm text-gray-600'>
                  Last Updated: {new Date().toLocaleDateString()}
               </p>
            </div>

            <div className='space-y-6 text-gray-700'>
               <p>
                  Welcome to cargas.io ("Website"), owned and operated by Car
                  Gas Inc ("Company," "we," "us," or "our"). By accessing or
                  using our Website, you agree to be bound by these Terms and
                  Conditions and our Privacy Policy. If you do not agree to
                  these terms, please do not use our Website.
               </p>

               <section>
                  <h2 className='text-xl font-semibold mb-2'>
                     1. Acceptance of Terms
                  </h2>
                  <p>
                     By accessing this Website, you acknowledge that you have
                     read, understood, and agree to be bound by these Terms and
                     Conditions and any applicable laws and regulations. If you
                     do not agree with these Terms and Conditions, you must
                     discontinue using this Website.
                  </p>
               </section>

               <section>
                  <h2 className='text-xl font-semibold mb-2'>2. Eligibility</h2>
                  <p>
                     You must be at least 18 years of age to use this Website.
                     By using this Website, you represent and warrant that you
                     are at least 18 years old and have the legal authority to
                     enter into these Terms and Conditions.
                  </p>
               </section>

               <section>
                  <h2 className='text-xl font-semibold mb-2'>
                     3. Use of Website
                  </h2>
                  <p>
                     You may use this Website solely for lawful purposes and in
                     accordance with these Terms. You agree not to:
                  </p>
                  <ul className='list-disc pl-6 mt-2 space-y-1'>
                     <li>
                        Use the Website in any way that violates any applicable
                        federal, state, local, or international law or
                        regulation.
                     </li>
                     <li>
                        Transmit, or procure the sending of, any advertising or
                        promotional material without our prior written consent.
                     </li>
                     <li>
                        Attempt to gain unauthorized access to any parts of the
                        Website or any systems or networks connected to the
                        Website.
                     </li>
                  </ul>
               </section>

               {/* Sections 4-12 follow the same pattern */}

               <section>
                  <h2 className='text-xl font-semibold mb-2'>12. Contact Us</h2>
                  <p>
                     If you have any questions about these Terms and Conditions,
                     please contact us at:
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

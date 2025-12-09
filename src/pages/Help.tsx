import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react';

const Help: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Is 9jalinks free to use?",
      a: "Yes! registering as a buyer or seller is completely free. We want to encourage trade without barriers."
    },
    {
      q: "How do I contact a seller?",
      a: "Click on any product you like. On the product detail page, you will see a 'Contact on WhatsApp' button. This will open a chat directly with the seller."
    },
    {
      q: "Is payment handled on the site?",
      a: "No. 9jalinks connects you with sellers. Payment and delivery details are agreed upon between you and the seller privately (e.g. via WhatsApp). Always meet in public places for transactions."
    },
    {
      q: "How do I become a seller?",
      a: "During sign up, check the 'Register as Seller' box. If you already have an account, go to your Profile settings to upgrade."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-white shadow-sm border-b">
         <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
         </div>
       </div>

       <div className="max-w-3xl mx-auto px-4 py-8">
         <button onClick={onBack} className="flex items-center text-gray-600 mb-8 hover:text-nigeria-green font-medium">
            <ArrowLeft size={20} className="mr-2" /> Back to Home
         </button>

         {/* FAQ Section */}
         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Frequently Asked Questions</h2>
            <div className="space-y-4">
               {faqs.map((faq, idx) => (
                 <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
                    >
                       <span className="font-medium text-gray-800">{faq.q}</span>
                       {openFaq === idx ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-200">
                        {faq.a}
                      </div>
                    )}
                 </div>
               ))}
            </div>
         </div>

         {/* Contact Section */}
         <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Still need help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-4 border rounded-lg flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full text-nigeria-green">
                     <Mail size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900">Email Support</h3>
                     <p className="text-sm text-gray-500 mb-2">We typically reply within 24 hours.</p>
                     <a href="mailto:support@9jalinks.ng" className="text-nigeria-green font-medium hover:underline">support@9jalinks.ng</a>
                  </div>
               </div>

               <div className="p-4 border rounded-lg flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                     <Phone size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-gray-900">Call Us</h3>
                     <p className="text-sm text-gray-500 mb-2">Mon-Fri from 8am to 5pm.</p>
                     <a href="tel:+2348009JALINKS" className="text-nigeria-green font-medium hover:underline">+234 800 9JALINKS</a>
                  </div>
               </div>
            </div>
         </div>

       </div>
    </div>
  );
};

export default Help;
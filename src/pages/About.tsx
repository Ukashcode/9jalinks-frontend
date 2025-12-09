import React from 'react';
import { ArrowLeft } from 'lucide-react';

const About: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-nigeria-green text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">About 9jalinks</h1>
          <p className="text-xl text-green-100">Connecting Nigeria, One Trade at a Time.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={onBack} className="flex items-center text-gray-600 mb-8 hover:text-nigeria-green font-medium">
           <ArrowLeft size={20} className="mr-2" /> Back to Home
        </button>

        <div className="space-y-12">
          {/* Mission */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At 9jalinks, we are driven by a singular purpose: to bridge the gap between local Nigerian sellers and buyers. 
              We believe in the power of our local economy. By providing a digital platform that is easy to use, secure, and widely accessible, 
              we empower small businesses, artisans, and everyday people to showcase their goods to a broader audience.
            </p>
          </section>

          {/* How It Works */}
          <section className="bg-gray-50 p-8 rounded-xl border border-gray-100">
             <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Work</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                   <div className="w-12 h-12 bg-green-100 text-nigeria-green rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                   <h3 className="font-bold mb-2">Connect</h3>
                   <p className="text-sm text-gray-600">Sellers list their products with ease. Buyers browse categories to find exactly what they need.</p>
                </div>
                <div className="text-center">
                   <div className="w-12 h-12 bg-green-100 text-nigeria-green rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                   <h3 className="font-bold mb-2">Chat</h3>
                   <p className="text-sm text-gray-600">Interested buyers connect directly with sellers via WhatsApp. Real people, real conversations.</p>
                </div>
                <div className="text-center">
                   <div className="w-12 h-12 bg-green-100 text-nigeria-green rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                   <h3 className="font-bold mb-2">Trade</h3>
                   <p className="text-sm text-gray-600">Negotiate, arrange delivery, and complete the sale off-platform. Safe and simple.</p>
                </div>
             </div>
          </section>

          {/* Vision */}
          <section>
             <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
             <p className="text-lg text-gray-700 leading-relaxed">
               To be the most trusted and vibrant online marketplace in West Africa, fostering entrepreneurship and making commerce accessible to everyone, 
               regardless of their location or technical expertise.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
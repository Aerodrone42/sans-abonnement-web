
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactHeader from "./contact/ContactHeader";
import ContactForm from "./contact/ContactForm";
import NeuralBackground from "./contact/NeuralBackground";

const Contact = () => {
  return (
    <div id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <NeuralBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ContactHeader />
          
          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

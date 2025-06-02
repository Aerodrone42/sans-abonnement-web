
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactHeader from "./contact/ContactHeader";
import ContactForm from "./contact/ContactForm";
import VoiceRecognition from "./contact/VoiceRecognition";
import NeuralBackground from "./contact/NeuralBackground";

const Contact = () => {
  return (
    <div id="contact" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <NeuralBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ContactHeader />
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <ContactForm />
            
            <Card className="bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-300 text-center">
                  🤖 Assistant IA Nova (avec apprentissage automatique)
                </CardTitle>
                <p className="text-gray-300 text-sm text-center">
                  Notre IA apprend de chaque conversation pour s'améliorer automatiquement
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <VoiceRecognition 
                  onTranscript={() => {}}
                  currentField="message"
                />
                
                <div className="bg-cyan-900/20 border border-cyan-400/30 rounded-lg p-3">
                  <p className="text-cyan-200 text-xs">
                    🧠 Mode apprentissage actif : Nova analyse et mémorise cette conversation pour s'améliorer
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;


import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Privacy = () => {
  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold mb-4">Privacy Policy for BeerMeTwice</h1>
          <p className="text-gray-500 mb-6">Last updated: March 19, 2025 (Los Angeles, CA)</p>
          
          <p>Thank you for choosing BeerMeTwice ("the App"). We respect your privacy and are committed to protecting it through our compliance with this policy. This Privacy Policy describes the information we do not collect, as well as how any information stored by the App is handled.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. No Collection of Personal Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>No Personal Data:</strong> BeerMeTwice does not collect or store any personally identifiable information (PII), such as your name, email address, or phone number.</li>
            <li className="mb-2"><strong>Local-Only Data:</strong> The only data the App stores is your drink count, which is saved locally on your device. This data does not leave your device and cannot be accessed by us or any third party.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. How Your Data Is Stored</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>Local Storage:</strong> All drink count information is kept in your device's local storage. There are no external servers involved.</li>
            <li className="mb-2"><strong>No Internet Requests:</strong> BeerMeTwice does not make any outgoing requests to the internet. This means your data is never transmitted to remote servers or third parties.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. User Control and Data Deletion</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>User-Initiated Deletion:</strong> You can delete your drink count history at any time within the App. Once deleted, the data is irretrievable.</li>
            <li className="mb-2"><strong>No Access by Developers:</strong> Because the data is stored locally and never sent to us, we do not have access to your information under any circumstances.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. No Sharing of Information</h2>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><strong>No Third Parties:</strong> We do not share, sell, or trade your data with any third parties.</li>
            <li className="mb-2"><strong>No Analytics:</strong> The App does not integrate with any analytics services or third-party data tools.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Security</h2>
          <p className="mb-4">Although your data is stored locally on your device, we recommend you protect access to your device with a secure passcode or biometric authentication to prevent unauthorized use.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes to This Privacy Policy</h2>
          <p className="mb-4">We may update our Privacy Policy from time to time. Any changes will be reflected by updating the "Last updated" date at the top of this page. Continued use of the App after any modifications to this Privacy Policy constitutes your acceptance of such changes.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;

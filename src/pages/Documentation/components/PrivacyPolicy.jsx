import React from "react";
import { Shield, Clock, Mail, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-gray-900 border-b-2 border-royal-blue pb-4">
          Privacy Policy – CultureConnect
        </h2>
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <Clock size={16} />
          <span>Last updated: January 24, 2026</span>
        </div>
      </div>

      {/* 1. Introduction */}
      <section id="introduction" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            1
          </span>
          Introduction
        </h3>
        <p className="text-gray-600 leading-relaxed">
          This Privacy Policy explains how CultureConnect (“we”, “us”, or “our”)
          collects, uses, and protects your information when you use our website
          and services, including our cultural marketplace and learning platform
          (the “Platform”).
        </p>
        <p className="text-gray-600 leading-relaxed">
          By accessing or using the Platform, you agree to the collection and
          use of information in accordance with this Policy.
        </p>
      </section>

      {/* 2. Information We Collect */}
      <section id="information-collect" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            2
          </span>
          Information We Collect
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We may collect the following types of information when you use the
          Platform:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>
            <strong>Account information:</strong> name, email address, password,
            phone number.
          </li>
          <li>
            <strong>Profile details:</strong> location, biography, profile
            photo, cultural interests.
          </li>
          <li>
            <strong>Transaction data:</strong> purchase history, booking
            details, payment status (we do not store full payment card details;
            these are handled by third-party payment processors).
          </li>
          <li>
            <strong>Content you provide:</strong> product listings, course
            information, messages, reviews, and feedback.
          </li>
          <li>
            <strong>Usage data:</strong> IP address, browser type, device
            information, pages visited, and actions taken on the Platform.
          </li>
          <li>
            <strong>Cookies and similar technologies:</strong> identifiers that
            help us remember your preferences and improve your experience.
          </li>
        </ul>
      </section>

      {/* 3. How We Use Your Information */}
      <section id="how-we-use" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            3
          </span>
          How We Use Your Information
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We use your information to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Create and manage your account.</li>
          <li>Process orders, bookings, and payments.</li>
          <li>
            Enable communication between buyers, sellers, gurus, and admins.
          </li>
          <li>Personalize your experience and show relevant content.</li>
          <li>Improve, maintain, and secure the Platform.</li>
          <li>
            Send you service-related notifications (for example, order updates,
            account alerts).
          </li>
          <li>
            Comply with legal obligations and enforce our Terms of Service.
          </li>
        </ul>
      </section>

      {/* 4. Legal Bases for Processing */}
      <section id="legal-bases" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            4
          </span>
          Legal Bases for Processing
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Depending on your location, we may process your information based on:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Your consent.</li>
          <li>
            The need to perform a contract with you (for example, when you buy a
            product or book a class).
          </li>
          <li>
            Our legitimate interests in operating and improving the Platform.
          </li>
          <li>Compliance with legal obligations.</li>
        </ul>
      </section>

      {/* 5. How We Share Your Information */}
      <section id="sharing-info" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            5
          </span>
          How We Share Your Information
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We may share your information with:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>
            Other users, as needed to complete transactions or bookings (for
            example, sharing your name and basic contact details with a seller
            or guru).
          </li>
          <li>
            Service providers who help us operate the Platform (for example,
            hosting, analytics, payment processing, email services).
          </li>
          <li>
            Authorities or third parties, if required by law, to protect our
            rights, or in connection with a legal claim or dispute.
          </li>
        </ul>
        <p className="text-gray-700 font-medium italic">
          We do not sell your personal information to third parties.
        </p>
      </section>

      {/* 6. Cookies and Tracking Technologies */}
      <section id="cookies" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            6
          </span>
          Cookies and Tracking Technologies
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We use cookies and similar technologies to remember your preferences,
          keep you signed in, analyze traffic, and improve the Platform.
        </p>
        <p className="text-gray-600 leading-relaxed">
          You can control cookies through your browser settings; however,
          disabling cookies may affect certain features.
        </p>
      </section>

      {/* 7. Data Retention */}
      <section id="retention" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            7
          </span>
          Data Retention
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We retain your information for as long as necessary to provide the
          services, fulfill the purposes described in this Policy, and comply
          with legal obligations.
        </p>
        <p className="text-gray-600 leading-relaxed">
          When data is no longer needed, we will delete or anonymize it where
          reasonably possible.
        </p>
      </section>

      {/* 8. Data Security */}
      <section id="security" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            8
          </span>
          Data Security
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We use reasonable technical and organizational measures to protect
          your information against loss, misuse, and unauthorized access.
        </p>
        <p className="text-red-500 font-medium">
          However, no method of transmission or storage is completely secure,
          and we cannot guarantee absolute security.
        </p>
      </section>

      {/* 9. Your Rights and Choices */}
      <section id="rights" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            9
          </span>
          Your Rights and Choices
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Depending on your location and applicable law, you may have the right
          to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Access the personal information we hold about you.</li>
          <li>Request correction of inaccurate or incomplete data.</li>
          <li>
            Request deletion of your data, subject to legal and contractual
            restrictions.
          </li>
          <li>Object to or restrict certain processing activities.</li>
          <li>Withdraw consent where processing is based on consent.</li>
        </ul>
        <p className="text-gray-600 leading-relaxed">
          To exercise your rights, contact us using the details provided below.
          We may need to verify your identity before processing your request.
        </p>
      </section>

      {/* 10. Children’s Privacy */}
      <section id="children" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            10
          </span>
          Children’s Privacy
        </h3>
        <p className="text-gray-600 leading-relaxed">
          The Platform is not intended for children under the age of 13 (or the
          minimum age required by applicable law). We do not knowingly collect
          personal information from children.
        </p>
        <p className="text-gray-600 leading-relaxed">
          If you believe a child has provided us with personal information,
          contact us so we can take appropriate steps to delete it.
        </p>
      </section>

      {/* 11. International Transfers */}
      <section id="transfers" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            11
          </span>
          International Transfers
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Your information may be transferred to and processed in countries
          other than your own, where data protection laws may differ.
        </p>
        <p className="text-gray-600 leading-relaxed">
          We take steps to ensure an adequate level of protection in accordance
          with applicable laws.
        </p>
      </section>

      {/* 12. Changes to This Privacy Policy */}
      <section id="changes" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            12
          </span>
          Changes to This Privacy Policy
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We may update this Privacy Policy from time to time. We will post the
          updated version on the Platform and update the “Last updated” date.
        </p>
        <p className="text-gray-600 font-medium">
          Your continued use of the Platform after any changes means you accept
          the updated Policy.
        </p>
      </section>

      {/* 13. Contact Us */}
      <section id="contact" className="space-y-6 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
            13
          </span>
          Contact Us
        </h3>
        <p className="text-gray-600 leading-relaxed">
          If you have questions or requests regarding this Privacy Policy, you
          can contact us at:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-royal-blue/10 flex items-center justify-center text-royal-blue shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email
              </p>
              <a
                href="mailto:cultureconnect0701@gmail.com"
                className="text-royal-blue hover:underline font-medium">
                cultureconnect0701@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-heritage-red/10 flex items-center justify-center text-heritage-red shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-1">
                Address
              </p>
              <p className="text-gray-600 font-medium">Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

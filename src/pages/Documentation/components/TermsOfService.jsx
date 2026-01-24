import React from "react";
import { Scale, Clock, Mail, MapPin, AlertTriangle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl space-y-12 pb-16">
      {/* Header */}
      <div className="space-y-4">
        <h2 className="text-3xl font-heading font-bold text-gray-900 border-b-2 border-heritage-red pb-4">
          Terms of Service – CultureConnect
        </h2>
        <div className="flex items-center gap-2 text-gray-500 font-medium">
          <Clock size={16} />
          <span>Last updated: January 24, 2026</span>
        </div>
      </div>

      {/* 1. Acceptance of Terms */}
      <section id="acceptance" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            1
          </span>
          Acceptance of Terms
        </h3>
        <p className="text-gray-600 leading-relaxed">
          These Terms of Service (“Terms”) govern your access to and use of
          CultureConnect, including our website, marketplace, and learning
          services (collectively, the “Platform”).
        </p>
        <p className="text-gray-700 font-medium">
          By accessing or using the Platform, you agree to be bound by these
          Terms. If you do not agree, you may not use the Platform.
        </p>
      </section>

      {/* 2. Users and Roles */}
      <section id="roles" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            2
          </span>
          Users and Roles
        </h3>
        <p className="text-gray-600 leading-relaxed">
          The Platform may be used by different types of users, including
          visitors, customers, sellers (artisans), gurus (experts), and admins.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Additional role-specific guidelines or policies may apply and are
          incorporated into these Terms by reference.
        </p>
      </section>

      {/* 3. Eligibility */}
      <section id="eligibility" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            3
          </span>
          Eligibility
        </h3>
        <p className="text-gray-600 leading-relaxed">
          You must be at least 18 years old, or the age of legal majority in
          your jurisdiction, to create an account and use the Platform to buy,
          sell, or offer classes.
        </p>
        <p className="text-gray-600 leading-relaxed">
          By using the Platform, you represent that you meet these requirements
          and that you have the authority to agree to these Terms.
        </p>
      </section>

      {/* 4. Account Registration and Security */}
      <section id="registration" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            4
          </span>
          Account Registration and Security
        </h3>
        <p className="text-gray-600 leading-relaxed">
          To access certain features, you must create an account and provide
          accurate, complete, and current information.
        </p>
        <p className="text-gray-600 leading-relaxed">
          You are responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Maintaining the confidentiality of your login credentials.</li>
          <li>All activities that occur under your account.</li>
          <li>Updating your information as needed to keep it accurate.</li>
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3 text-amber-800 text-sm">
          <AlertTriangle size={18} className="shrink-0" />
          <p>
            Notify us immediately if you suspect unauthorized access to your
            account.
          </p>
        </div>
      </section>

      {/* 5. Use of the Platform */}
      <section id="platform-use" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            5
          </span>
          Use of the Platform
        </h3>
        <p className="text-gray-600 leading-relaxed">
          You agree to use the Platform only for lawful purposes and in
          accordance with these Terms.
        </p>
        <p className="text-gray-600 leading-relaxed">You agree not to:</p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Violate any applicable laws or regulations.</li>
          <li>
            Post or transmit any content that is harmful, abusive, hateful,
            defamatory, or discriminatory.
          </li>
          <li>
            Infringe the intellectual property or privacy rights of others.
          </li>
          <li>
            Attempt to interfere with the security, integrity, or proper
            functioning of the Platform.
          </li>
          <li>
            Use the Platform to conduct transactions outside the Platform that
            circumvent fees or protections.
          </li>
        </ul>
        <p className="text-red-600 font-medium">
          We may suspend or terminate your access if we believe you have
          violated these Terms.
        </p>
      </section>

      {/* 6. Marketplace and Learning Services */}
      <section id="services" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            6
          </span>
          Marketplace and Learning Services
        </h3>
        <p className="text-gray-600 leading-relaxed">
          CultureConnect connects buyers with sellers (artisans) and learners
          with gurus (experts). We do not own or produce the products or
          services listed by users.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>
            <strong>Sellers</strong> are responsible for accuracy of listings,
            pricing, and fulfillment.
          </li>
          <li>
            <strong>Gurus</strong> are responsible for quality, content, and
            delivery of classes.
          </li>
          <li>
            <strong>Buyers/Learners</strong> are responsible for reviewing
            listings and making choices.
          </li>
        </ul>
        <p className="text-gray-500 italic">
          We may, but are not obligated to, mediate disputes between users.
        </p>
      </section>

      {/* 7. Orders, Bookings, Payments, and Fees */}
      <section id="payments" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            7
          </span>
          Orders, Bookings, Payments, and Fees
        </h3>
        <p className="text-gray-600 leading-relaxed">
          When you place an order or book a session, you agree to pay the
          displayed price, taxes, fees, and shipping costs.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>
            Payments are processed by third-party providers subject to their
            terms.
          </li>
          <li>
            Confirmed once payment is processed and you receive a confirmation.
          </li>
          <li>
            We reserve the right to cancel orders for suspected fraud or errors.
          </li>
        </ul>
      </section>

      {/* 8. Shipping, Delivery, and Returns */}
      <section id="shipping" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            8
          </span>
          Shipping, Delivery, and Returns
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Shipping and delivery are the responsibility of the seller.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Our general return guideline:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>
            Returns may be accepted within 7 days ONLY if product is damaged,
            defective, or not as described.
          </li>
          <li>Subject to review and evidence (photos).</li>
        </ul>
      </section>

      {/* 9. Cancellations and Refunds (Classes) */}
      <section id="cancellations" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            9
          </span>
          Cancellations and Refunds (Classes)
        </h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>Policies vary by guru and are displayed on course pages.</li>
          <li>
            Late cancellations or no-shows may not be eligible for refunds.
          </li>
        </ul>
      </section>

      {/* 10. User Content and Intellectual Property */}
      <section id="ip" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            10
          </span>
          User Content and Intellectual Property
        </h3>
        <p className="text-gray-600 leading-relaxed">
          You retain ownership of your content but grant us a license to use it
          for operating and promoting the Platform.
        </p>
        <p className="text-gray-600 leading-relaxed">
          All rights in the Platform (design, logo, software) are owned by us.
        </p>
      </section>

      {/* 11. Cultural Sensitivity */}
      <section id="cultural-sensitivity" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            11
          </span>
          Cultural Sensitivity
        </h3>
        <p className="text-gray-600 leading-relaxed font-medium">
          Users must respect the cultural significance of items and practices.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-600">
          <li>No misrepresentation or exploitation.</li>
          <li>No stereotyping or disrespect.</li>
          <li>No illegal or stolen cultural items.</li>
        </ul>
      </section>

      {/* 12. Disclaimers */}
      <section id="disclaimers" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            12
          </span>
          Disclaimers
        </h3>
        <p className="text-gray-600 leading-relaxed italic">
          The Platform is provided “as is” and “as available” without warranties
          of any kind.
        </p>
      </section>

      {/* 13. Limitation of Liability */}
      <section id="liability" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            13
          </span>
          Limitation of Liability
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We shall not be liable for indirect, incidental, or consequential
          damages.
        </p>
      </section>

      {/* 14. Indemnification */}
      <section id="indemnification" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            14
          </span>
          Indemnification
        </h3>
        <p className="text-gray-600 leading-relaxed">
          You agree to indemnify CultureConnect against claims arising from your
          use of the Platform.
        </p>
      </section>

      {/* 15. Changes to the Terms */}
      <section id="changes" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            15
          </span>
          Changes to the Terms
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We may update these Terms from time to time by posting the updated
          version.
        </p>
      </section>

      {/* 16. Termination */}
      <section id="termination" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            16
          </span>
          Termination
        </h3>
        <p className="text-gray-600 leading-relaxed">
          We may suspend or terminate your account at any time for violations or
          harmful activity.
        </p>
      </section>

      {/* 17. Governing Law */}
      <section id="governing-law" className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            17
          </span>
          Governing Law
        </h3>
        <p className="text-gray-600 leading-relaxed">
          These Terms are governed by the laws of <strong>Nepal</strong>.
        </p>
      </section>

      {/* 18. Contact Information */}
      <section id="contact" className="space-y-6 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
            18
          </span>
          Contact Information
        </h3>
        <p className="text-gray-600 leading-relaxed">
          If you have questions about these Terms, you can contact us at:
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

export default TermsOfService;

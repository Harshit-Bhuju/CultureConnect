import React from "react";

const DocContent = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* 1. High-Level Overview */}
      <section id="overview" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            1. High-Level Overview
          </h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-royal-blue">
            Project Overview
          </h3>
          <p className="text-gray-700 leading-relaxed">
            <strong>CultureConnect</strong> is a cultural e-commerce and
            learning platform tailored to bridge the gap between traditional
            artisans, experts, and a global audience. It solves the problem of
            fading cultural heritage by providing a marketplace for authentic
            goods and a learning platform for cultural skills.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-royal-blue">
            <h4 className="font-bold text-royal-blue mb-2">Target Audience</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>
                <strong>Artisans/Sellers:</strong> Creators of traditional
                crafts.
              </li>
              <li>
                <strong>Gurus/Experts:</strong> Teachers of cultural arts
                (dance, music).
              </li>
              <li>
                <strong>Learners:</strong> Students interested in cultural
                skills.
              </li>
              <li>
                <strong>Buyers:</strong> Customers seeking authentic cultural
                products.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-royal-blue">Glossary</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="font-bold text-heritage-red block mb-1">
                Guru
              </span>
              <p className="text-sm text-gray-600">
                An expert teacher or instructor offering classes/workshops.
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <span className="font-bold text-heritage-red block mb-1">
                Artisan
              </span>
              <p className="text-sm text-gray-600">
                A seller specializing in hand-crafted, culturally significant
                items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. User Roles */}
      <section id="roles" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            2. User Roles & Permissions
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-900 border-b-2 border-gray-300">
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Key Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-4 font-semibold text-royal-blue">Visitor</td>
                <td className="p-4">
                  Browse products, view courses, read reviews.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-royal-blue">Customer</td>
                <td className="p-4">
                  Purchase items, book classes, rate/review, manage profile.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-royal-blue">Seller</td>
                <td className="p-4">
                  List products, manage inventory, view orders, request payouts.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-royal-blue">Guru</td>
                <td className="p-4">
                  Create courses, manage schedule, host sessions.
                </td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-royal-blue">Admin</td>
                <td className="p-4">
                  Full system access, dispute resolution, content moderation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Features */}
      <section id="features" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            3. Feature Documentation
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="tex-lg font-bold text-gray-900 mb-3">Marketplace</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>Categories:</strong> Traditional Clothing, Instruments,
                Arts.
              </li>
              <li>
                <strong>Filters:</strong> Price, Region, Material, Artisan.
              </li>
              <li>
                <strong>Product Page:</strong> Deep cultural context, artisan
                bio integration.
              </li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="tex-lg font-bold text-gray-900 mb-3">
              Learn Culture
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>
                <strong>Content:</strong> Dance, Singing, Crafts.
              </li>
              <li>
                <strong>Booking:</strong> Slot selection, seamless payment.
              </li>
              <li>
                <strong>Session Types:</strong> 1-on-1, Group Workshops
                (Online/Offline).
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Shopping flows */}
      <section id="shopping" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            4. Shopping & Payments
          </h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-royal-blue">Order Lifecycle</h3>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50 p-6 rounded-xl">
            <div className="text-center">
              <div className="w-10 h-10 bg-royal-blue text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                1
              </div>
              <span className="font-medium">Created</span>
            </div>
            <div className="h-1 w-12 bg-gray-300 md:block hidden"></div>
            <div className="text-center">
              <div className="w-10 h-10 bg-royal-blue text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                2
              </div>
              <span className="font-medium">Paid</span>
            </div>
            <div className="h-1 w-12 bg-gray-300 md:block hidden"></div>
            <div className="text-center">
              <div className="w-10 h-10 bg-royal-blue text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                3
              </div>
              <span className="font-medium">Shipped</span>
            </div>
            <div className="h-1 w-12 bg-gray-300 md:block hidden"></div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                4
              </div>
              <span className="font-medium">Delivered</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-sm text-yellow-800">
            <strong>Note on Returns:</strong> Returns are accepted within 7 days
            of delivery only if the product is damaged or incorrect. Admin
            approval is required for disputes.
          </div>
        </div>
      </section>

      {/* 5. Technical */}
      <section id="technical" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            5. Technical Architecture
          </h2>
        </div>

        <div className="prose max-w-none text-gray-600">
          <p>
            The platform is built using a modern <strong>React</strong> frontend
            structure with a custom <strong>PHP/MySQL</strong> backend API using
            session-based authentication.
          </p>

          <h4 className="text-gray-900 font-bold mt-4">Core Tech Stack</h4>
          <ul className="grid grid-cols-2 gap-2 mt-2">
            <li className="bg-gray-100 px-3 py-1 rounded">
              React 18 & Tailwind
            </li>
            <li className="bg-gray-100 px-3 py-1 rounded">
              PHP (Custom Backend)
            </li>
            <li className="bg-gray-100 px-3 py-1 rounded">MySQL (Database)</li>
            <li className="bg-gray-100 px-3 py-1 rounded">
              Context API (State)
            </li>
          </ul>
        </div>
      </section>

      {/* 6. Non-functional */}
      <section id="non-functional" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            6. Non-Functional & SEO
          </h2>
        </div>
        <p className="text-gray-700">
          <strong>Performance Goal:</strong> All pages load under 2 seconds.
          Images are lazy-loaded and optimized. <br />
          <strong>SEO:</strong> Semantic HTML5, proper meta tags, and structured
          data for products and courses.
        </p>
      </section>

      {/* 7. Content */}
      <section id="content" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            7. Content Guidelines
          </h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-heritage-red mb-2">
            Cultural Sensitivity
          </h3>
          <p className="text-gray-600 mb-4">
            All content must respectful. Avoid stereotyping. Use authentic
            terminology where possible (e.g., "Mithila Art" instead of just
            "Folk Art").
          </p>

          <h3 className="font-bold text-royal-blue mb-2">Image Quality</h3>
          <p className="text-gray-600">
            High-resolution images only. White or neutral backgrounds for
            products. Action shots for courses.
          </p>
        </div>
      </section>

      {/* 8. Operations */}
      <section id="operations" className="scroll-mt-24 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">8. Operations</h2>
        </div>
        <p className="text-gray-700">
          Admins are responsible for verifying new sellers and gurus within 48
          hours of registration. Support tickets should be responded to within
          24 hours.
        </p>
      </section>
    </div>
  );
};

export default DocContent;

import React from 'react';

const TandC: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 bg-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
          Terms & Conditions
        </h1>
        <p className="text-gray-500 mt-4">Last Updated: 03-Sept-2025</p>
      </div>

      {/* Content */}
      <div className="space-y-12">
        {/* Section 1: Introduction */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            1. Introduction
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Welcome to faujx, an employee recruitment brokerage platform. These
            Terms and Conditions (&quot;Terms&quot;) govern your use of our
            services, services, website, and platform (collectively, the
            &quot;Service&quot;). By accessing or using faujx, you agree to be
            bound by these Terms.
          </p>
        </section>

        {/* Section 2: About Our Service */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            2. About Our Service
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            faujx is a recruitment platform that connects:
          </p>
          <ul className="space-y-4 text-gray-600 leading-relaxed text-lg">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                <strong>Entry-Level Engineers:</strong> Engineers with limited
                professional experience (typically less than 1 year)
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                <strong>Companies:</strong> Organizations seeking to hire
                qualified engineering talent
              </span>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed text-lg mt-4">
            Our platform is supported by <strong>Experts</strong> who provide
            mentoring services to candidates and assist companies with interview
            processes.
          </p>
        </section>

        {/* Section 3: User Categories and Eligibility */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            3. User Categories and Eligibility
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                3.1 Entry-Level Engineers
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Must have limited professional engineering experience
                    (typically less than 1 year)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Must be legally eligible to work in their jurisdiction
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Must provide accurate and truthful information during
                    registration and assessment
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                3.2 Companies
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Must be legitimate business entities with valid registration
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Must have genuine intent to recruit and hire candidates
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Must comply with employment laws and regulations in their
                    jurisdiction
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 4: Registration and Account Management */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            4. Registration and Account Management
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                4.1 Account Creation
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Users must provide accurate, current, and complete
                    information during registration
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Users are responsible for maintaining the confidentiality of
                    their account credentials
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    One person may not maintain multiple accounts of the same
                    type
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                4.2 Account Verification
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    faujx reserves the right to verify user information and
                    qualifications
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Accounts may be suspended pending verification</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    False or misleading information may result in account
                    termination
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Service Process */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            5. Service Process
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                5.1 For Entry-Level Engineers
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Complete registration and profile setup</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Participate in faujx&apos;s interview and testing process
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Upon successful completion, profiles will be listed on our
                    platform
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Respond professionally to company inquiries and interview
                    requests
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Participate in mentoring sessions with faujx experts
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                5.2 For Companies
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Browse and shortlist candidate profiles</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Request interviews through the platform</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Conduct interviews with expert assistance (optional)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Make hiring decisions based on your evaluation criteria
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Complete hiring process according to applicable employment
                    laws
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6: Fees and Payment */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            6. Fees and Payment
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                6.1 Service Fees
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    faujx charges fees for successful placements and expert
                    services
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Fee structure will be clearly communicated before service
                    commencement
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Companies are responsible for placement fees upon successful
                    hiring
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Expert services may be subject to additional fees</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                6.2 Payment Terms
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Fees must be paid within 30 days of invoice date</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Late payments may incur additional charges</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    faujx reserves the right to suspend services for overdue
                    accounts
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 7: User Responsibilities */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            7. User Responsibilities
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                7.1 General Obligations
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Comply with all applicable laws and regulations</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Respect intellectual property rights</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Maintain professional conduct in all platform interactions
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Keep account information current and accurate</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                7.2 Prohibited Activities
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Providing false or misleading information</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Attempting to circumvent the platform to conduct direct
                    hiring
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Harassment, discrimination, or unprofessional behavior
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Unauthorized use of other users&apos; information</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Attempting to reverse engineer or copy the platform
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 8: Intellectual Property */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            8. Intellectual Property
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                8.1 Platform Content
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    faujx owns all rights to the platform, including design,
                    functionality, and proprietary algorithms
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Users may not reproduce, distribute, or create derivative
                    works without permission
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                8.2 User Content
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Users retain rights to their original content (profiles,
                    resumes, etc.)
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Users grant faujx a license to use, display, and distribute
                    user content as necessary for service provision
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Users warrant they have the right to share all uploaded
                    content
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 9: Privacy and Data Protection */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            9. Privacy and Data Protection
          </h2>
          <ul className="space-y-3 text-gray-600 leading-relaxed">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                User privacy is governed by our Privacy Policy, incorporated by
                reference
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                faujx implements appropriate security measures to protect user
                data
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                Users consent to data processing as described in our Privacy
                Policy
              </span>
            </li>
          </ul>
        </section>

        {/* Section 10: Disclaimers and Limitations */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            10. Disclaimers and Limitations
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                10.1 Service Availability
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    faujx makes no guarantee of placement success for candidates
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    We cannot guarantee the availability or suitability of any
                    particular candidate or company
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Services are provided on an &quot;as is&quot; basis
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                10.2 Limitation of Liability
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    faujx&apos;s liability is limited to the fees paid for
                    services
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    We are not liable for indirect, incidental, or consequential
                    damages
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Users assume responsibility for their hiring and employment
                    decisions
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 11: Employment Relationships */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            11. Employment Relationships
          </h2>
          <ul className="space-y-3 text-gray-600 leading-relaxed">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                faujx is not a party to any employment relationship between
                candidates and companies
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                All employment terms, compensation, and working arrangements are
                solely between the hiring company and candidate
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                faujx is not responsible for employment disputes or issues
              </span>
            </li>
          </ul>
        </section>

        {/* Section 12: Termination */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            12. Termination
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                12.1 User Termination
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Users may terminate their accounts at any time</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Upon termination, access to the platform will cease
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>Outstanding fees remain due</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                12.2 faujx Termination Rights
              </h3>
              <ul className="space-y-3 text-gray-600 leading-relaxed">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    faujx may suspend or terminate accounts for violations of
                    these Terms
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    We may modify or discontinue services with reasonable notice
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
                  <span>
                    Termination does not relieve users of payment obligations
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 13: Modification of Terms */}
        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            13. Modification of Terms
          </h2>
          <ul className="space-y-3 text-gray-600 leading-relaxed">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>faujx may update these Terms from time to time</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>Material changes will be communicated to users</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mt-3 mr-4 flex-shrink-0"></span>
              <span>
                Continued use after changes constitutes acceptance of new Terms
              </span>
            </li>
          </ul>
        </section>

        {/* Section 14: Dispute Resolution */}

        {/* Section 16: Miscellaneous */}

        <section>
          <h2 className="text-2xl font-medium text-gray-800 mb-6">
            14. Contact Information
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg mb-4">
            For questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-800 font-medium mb-2">faujx</p>
            <p className="text-gray-600">
              LinkedIn:{' '}
              <a
                href="https://www.linkedin.com/company/faujx/"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                https://www.linkedin.com/company/faujx/
              </a>
            </p>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center pt-12 border-t border-gray-200">
          <p className="text-gray-500 italic">
            By using faujx services, you acknowledge that you have read,
            understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TandC;

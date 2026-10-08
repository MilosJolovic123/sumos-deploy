import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/shared/PageHeader";

const h1 = "mb-4 text-2xl font-bold sm:text-3xl md:text-4xl";
const h2 = "mt-8 mb-3 text-lg font-semibold sm:text-xl md:mt-10 md:text-2xl";
const h3 = "mt-6 mb-2 text-base font-semibold md:text-lg";
const p = "mb-4 text-sm leading-relaxed md:text-base text-justify";
const ul = "mb-4 list-disc space-y-1 pl-5 text-sm leading-relaxed md:text-base text-justify";
const link = "break-words underline underline-offset-2 hover:opacity-80";
const th = "border px-3 py-2 text-left align-top font-semibold md:px-4 md:py-3";
const td = "border px-3 py-2 align-top md:px-4 md:py-3";
const section = "scroll-mt-24";

export default function PrivacyPolicy() {
  const headerTitle = "Terms of Service & Privacy Policy";
  const headerSubtitle = "";

  return (
    <Layout>
      <PageHeader title={headerTitle} subtitle={headerSubtitle} />

      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* ===================== TERMS OF SERVICE ===================== */}
        <section id="terms" className={section}>

            <h1 className={h1}>Terms of Service for Green Benchmarking Tool</h1>
          <p className={p}>
            <strong>Last updated: September 29, 2026</strong>
          </p>

          <p className={p}>
            These are the Terms of Service governing the use of this Service and
            the agreement that operates between You and the University of
            Zagreb, Faculty of Organization and Informatics, SuMoS project.
            These Terms of Service set out the rights and obligations of all
            users regarding the use of the Service.
          </p>
          <p className={p}>
            Please read these Terms of Service (&quot;Terms&quot;) carefully
            before using the Green benchmarking tool (the &quot;Service&quot;)
            operated by University of Zagreb, Faculty of Organization and
            Informatics, SuMoS project (&quot;us&quot;, &quot;we&quot;, or
            &quot;our&quot;).
          </p>
          <p className={p}>
            You can find more information about the SuMoS project on the Project
            website:{" "}
            <strong>
<a
              href="https://sumos-project.eu"
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              https://sumos-project.eu/en
            </a>
            
            </strong>
            .
          </p>
          <p className={p}>
            Your access to and use of the Service is conditioned upon your
            acceptance of and compliance with these Terms. These Terms apply to
            all visitors, users, and others who wish to access or use the
            Service.
          </p>
          <p className={p}>
            Our Privacy Policy describes our policies and procedures on the
            collection, use and disclosure of Your personal information when You
            use the Service and tells You about Your privacy rights and how the
            law protects You. Please read our{" "}
            <strong>

            <a href="#privacy" className={link}>
              Privacy Policy
            </a>{" "}
            carefully before using our Service.
            </strong>
          </p>

          <h2 className={h2}>1. Acceptance of Terms</h2>
          <p className={p}>
            By accessing or using the Service, you agree to be bound by these
            Terms. If you disagree with any part of the terms, then you do not
            have permission to access the Service.
          </p>

          <h2 className={h2}>2. The Service and Nature of Results</h2>
          <p className={p}>
            The Service is an online utility designed to provide estimated
            calculations of student&apos;s green score (the &quot;Green
            score&quot;) based solely on the data input by the user.
          </p>
          <p className={p}>
            You acknowledge and agree that the accuracy of the Green score is
            entirely dependent on the accuracy, completeness, and truthfulness
            of the data you input into the Service (e.g., awareness, attitudes,
            habits and barriers).
          </p>
          <p className={p}>This service is available free of charge.</p>

          <h2 className={h2}>3. Critical Disclaimer And Limitation Of Liability</h2>
          <p className={p}>
            The Green score and any associated information, recommendations, or
            data provided by the Service are for{" "}
            <strong>informational, educational, and general guidance purposes only</strong>.
            They do not constitute, and should not be relied upon as,
            professional advice, scientific consultation, financial planning, or
            any form of certified environmental assessment.
          </p>
          <p className={p}>
            We utilize calculations developed by the SuMoS project team.
            However, we <strong>do not warrant or guarantee</strong> the
            precision, reliability, completeness, or suitability of the Green
            score for any particular purpose.
          </p>
          <p className={p}>
            The Service is provided on an{" "}
            <strong>&quot;AS IS&quot; and &quot;AS AVAILABLE&quot;</strong>{" "}
            basis, without any warranties of any kind.
          </p>

          <h3 className={h3}>Limitation of Liability</h3>
          <p className={p}>
            Without limitation to the foregoing, the University of Zagreb,
            Faculty of Organization and Informatics provides no warranty or
            undertaking, and makes no representation of any kind that the
            Service will meet Your requirements, achieve any intended results,
            be compatible or work with any other software, applications,
            systems, or services, operate without interruption, meet any
            performance or reliability standards or be error free or that any
            errors or defects can or will be corrected.
          </p>
          <p className={p}>
            The University of Zagreb, Faculty of Organisation and Informatics,
            is not responsible for the content entered by the users. You
            expressly understand and agree that You are solely responsible for
            the content and for all activity that occurs under your created
            content and actions that you do with your score results.
          </p>

          <h2 className={h2}>4. Service Usage</h2>
          <p className={p}>You agree not to use the Service:</p>
          <ul className={ul}>
            <li>
              In any way that violates any applicable national or international
              law or regulation.
            </li>
            <li>
              For the purpose of exploiting, harming, or attempting to exploit
              or harm minors in any way.
            </li>
            <li>
              To transmit or procure the sending of any advertising or
              promotional material, including &quot;junk mail,&quot; &quot;chain
              letter,&quot; &quot;spam,&quot; or any other similar solicitation.
            </li>
          </ul>

          <h2 className={h2}>5. Governing Law</h2>
          <p className={p}>
            These Terms shall be governed and construed in accordance with the
            laws of Republic of Croatia without regard to its conflict of law
            provisions.
          </p>

          <h2 className={h2}>6. Changes to Terms</h2>
          <p className={p}>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. We will provide at least 30 days&apos;
            notice prior to any new terms taking effect. By continuing to access
            or use our Service after any revisions become effective, you agree
            to be bound by the revised terms. New terms will be published under
            the new version and previous terms will be available for the
            reference.
          </p>

          <h2 className={h2}>7. Contact Information</h2>
          <p className={p}>
            If you have any questions about these Terms, please contact us at:
          </p>
          <address className={`${p} not-italic`}>
            University of Zagreb, Faculty of Organization and Informatics
            <br />
            SuMoS project
            <br />
            Pavlinska 2, 4200 Varaždin, Croatia
            <br />
            mail:{" "}
            <a href="mailto:sumos@foi.unizg.hr" className={link}>
              sumos@foi.unizg.hr
            </a>
          </address>
        </section>

        <hr className="my-10 border-t md:my-14" />

        {/* ===================== PRIVACY POLICY ===================== */}
        <section id="privacy" className={section}>
          <h1 className={h1}>Privacy Policy for Green Benchmarking Tool</h1>

          <p className={p}>
            <strong>Last updated: September 29, 2026</strong>
          </p>
          <p className={p}>
            This Privacy Policy describes how University of Zagreb, Faculty of
            Organization and Informatics (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) collects, uses, and discloses your personal data
            when you use our Green Benchmarking Tool (the &quot;Service&quot;).
          </p>
          <p className={p}>
            We are committed to protecting your privacy and ensuring you
            understand how your personal information and usage data are handled.
          </p>

          <h2 className={h2}>1. Data Controller</h2>
          <p className={p}>
            The data controller responsible for the processing of your personal
            data is:
          </p>
          <address className={`${p} not-italic`}>
            Faculty of Organization and Informatics, University of Zagreb
            <br />
            SuMoS project
            <br />
            Pavlinska 2, 4200 Varaždin, Croatia
            <br />
            mail:{" "}
            <a href="mailto:sumos@foi.unizg.hr" className={link}>
              sumos@foi.unizg.hr
            </a>
          </address>

          <h2 className={h2}>2. Information We Collect</h2>
          <p className={p}>
            We collect several different types of information for various
            purposes to provide and improve our Service to you.
          </p>

          <h3 className={h3}>2.1. Personal data</h3>
          <p className={p}>
            We collect Personal Data that you voluntarily provide to us when you
            use the Service or contact us. This may include:
          </p>
          <ul className={ul}>
            <li>Contact Data: Email address.</li>
            <li>Optional affiliation data</li>
            <li>Your IP address</li>
          </ul>

          <h3 className={h3}>2.2. Green score calculation data (Usage and input data)</h3>
          <p className={p}>
            This refers to the non-personal data you input specifically for the
            purpose of calculating your environmental footprint. This data is
            essential for the Service to function.
          </p>

          <h3 className={h3}>2.3. Usage Data and Tracking</h3>
          <p className={p}>
            We may also collect information that your browser sends whenever you
            visit our Service, i.e. IP address, browser type, operating system,
            screen resolution, pages visited, time spent on those pages, and
            other diagnostic data, as well as tracking technologies to track
            activity and hold certain information.
          </p>

          <h2 className={h2}>3. How We Use Your Data</h2>
          <p className={p}>
            We use the collected data for various purposes, primarily based on
            the legal grounds outlined in the GDPR (if applicable, e.g., consent
            or legitimate interest):
          </p>

          <div className="mb-4 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-xs sm:text-sm md:text-base">
              <thead>
                <tr>
                  <th className={th}>Data type</th>
                  <th className={th}>Purpose of use</th>
                  <th className={th}>Legal basis (GDPR example)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={`${td} font-semibold`}>Personal data (email address)</td>
                  <td className={td}>
                    To provide information about the Green score with you.
                  </td>
                  <td className={td}>Performance of a contract with you.</td>
                </tr>
                <tr>
                  <td className={`${td} font-semibold`}>Green score data</td>
                  <td className={td}>
                    To perform the core function of the Service: calculating and
                    displaying your green score estimates.
                  </td>
                  <td className={td}>
                    Performance of a contract / Legitimate interest (to provide
                    the service).
                  </td>
                </tr>
                <tr>
                  <td className={`${td} font-semibold`}>Green score data (Aggregated)</td>
                  <td className={td}>
                    To analyze trends, improve our calculation methodologies,
                    and generate generalized reports for research.
                  </td>
                  <td className={td}>Legitimate interest (improving the Service).</td>
                </tr>
                <tr>
                  <td className={`${td} font-semibold`}>Usage data</td>
                  <td className={td}>
                    To monitor and analyze the use of the Service, detect,
                    prevent, and address technical issues. Since this Service is
                    developed in the scope of SuMoS research project, we
                    maintain the possibility to use Your data for research
                    purposes. Research data collection and analysis is
                    coordinated by University of Zagreb, Faculty of Organization
                    and Informatics. Gathered data may be made available to
                    national and international research partners strictly for
                    research purposes and only after anonymization.
                  </td>
                  <td className={td}>Legitimate interest (security and optimization).</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className={h2}>4. Storing personal data</h2>
          <p className={p}>
            All the data, including personal data is stored at the University of
            Zagreb, Faculty of Organization and Informatics, Varaždin, Croatia
            (within EU). Data is stored in a protected and secure environment
            with all necessary and reasonable security procedures in place.
          </p>

          <h2 className={h2}>5. Aggregation and Anonymization of Green score data</h2>
          <p className={p}>We prioritize your privacy concerning your personal habits:</p>
          <ul className={ul}>
            <li>
              <strong>Anonymisation:</strong> We reserve the right to aggregate
              and anonymize your Green score calculation data. Once data is
              aggregated and anonymized, it no longer constitutes personal data.
            </li>
            <li>
              <strong>Purpose:</strong> We may use this aggregated,
              non-identifiable data for industry benchmarking, public reports on
              environmental trends, and for sharing with partners (e.g., NGOs,
              researchers) for educational and environmental awareness purposes.{" "}
              <strong>
                No individual user will be identifiable from this aggregated
                data.
              </strong>
            </li>
          </ul>

          <h2 className={h2}>6. Disclosure of data</h2>
          <p className={p}>
            We may disclose your personal data in the good faith belief that
            such action is necessary to:
          </p>
          <ul className={ul}>
            <li>Comply with a legal obligation</li>
            <li>
              Protect and defend the rights or property of University of Zagreb,
              Faculty of Organization and Informatics, SuMoS project.
            </li>
            <li>
              Prevent or investigate possible wrongdoing in connection with the
              Service.
            </li>
          </ul>

          <h2 className={h2}>7. Your data protection rights (GDPR)</h2>
          <p className={p}>
            If you are a resident of the European Economic Area (EEA), you have
            certain data protection rights. You have the right to:
          </p>
          <ul className={ul}>
            <li>The Right to Information</li>
            <li>The Right of Access</li>
            <li>The Right to Rectification</li>
            <li>The Right to Erasure</li>
            <li>The Right to Restriction of Processing</li>
            <li>The Right to Data Portability</li>
            <li>The Right to Object</li>
            <li>The Right to Avoid Automated Decision-Making</li>
          </ul>
          <p className={p}>
            To exercise any of these rights, please contact us at{" "}
            <a href="mailto:dpo@foi.unizg.hr" className={link}>
              dpo@foi.unizg.hr
            </a>
          </p>

          <h2 className={h2}>8. Security of Data</h2>
          <p className={p}>
            Data is stored in a protected and secure environment with all
            necessary and reasonable security procedures in place.
          </p>

          <h2 className={h2}>9. Changes to this Privacy Policy</h2>
          <p className={p}>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date at the top.
          </p>
        </section>
      </div>
    </Layout>
  );
}
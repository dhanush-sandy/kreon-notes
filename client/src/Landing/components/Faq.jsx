import React from 'react'

const Faq = () => {
  return (
    <section id="faq" className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Notely. Can't find the answer
            you're looking for? Contact our support team.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "How does the reminder system work?",
              answer:
                "Notely allows you to set reminders for any note. You can choose to receive notifications via email, WhatsApp, or both. The system will automatically send you a notification at the specified date and time.",
            },
            {
              question: "Can I access my notes offline?",
              answer:
                "Yes, Notely has offline capabilities. Your notes are stored locally on your device and will sync with the cloud once you're back online.",
            },
            {
              question: "Is my data secure?",
              answer:
                "Absolutely. We use industry-standard encryption to protect your data. Your notes are private and only accessible to you unless you explicitly share them.",
            },
            {
              question: "Can I cancel my subscription anytime?",
              answer:
                "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your subscription until the end of your current billing period.",
            },
            {
              question: "How do I share notes with my team?",
              answer:
                "With our Team plan, you can easily share notes and folders with team members. Simply select the note or folder you want to share, click the share button, and enter your team member's email address.",
            },
          ].map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq
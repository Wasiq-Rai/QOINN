import InvestmentForm from '@/components/meeting/InvestmentForm'

export default function InvestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
        
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-1">
          <div className="flex justify-center mb-4">
            <img src="/logo-name.png" alt="InvestPro Logo" className="" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-4">
            Schedule an Investment Meeting
          </h1>
          <div>
            <h2 className="text-2xl font-semibold mb-4">About QOINN</h2>
            <p className="text-gray-700 mb-4">
              QOINN is an innovative investment model that leverages cutting-edge technology and market insights to deliver exceptional returns. By investing in QOINN, you're partnering with a team of experts dedicated to maximizing your financial growth.
            </p>
            <h3 className="text-xl font-semibold mb-2">Key Benefits:</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>High potential returns</li>
              <li>Diversified portfolio</li>
              <li>Expert management</li>
              <li>Transparent reporting</li>
            </ul>
            <p className="text-gray-700">
              To learn more about this exciting opportunity and discuss your investment options, please schedule a Zoom meeting with our team using the form on the right.
            </p>
          </div>
        </div>
        <div className="md:col-span-1">
          <InvestmentForm />
        </div>
      </div>
    </div>
  )
}
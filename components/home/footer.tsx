export default function Footer() {
  return (
    <footer className="px-4 py-12 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4 text-green-400">Gym Nutrition</h3>
        <p className="text-gray-400 mb-6">Empowering your fitness journey, one meal at a time.</p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
            Terms
          </a>
          <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

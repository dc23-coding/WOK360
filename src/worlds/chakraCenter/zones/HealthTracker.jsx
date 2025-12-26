// Health Tracker Zone - Lazy loaded
export default function HealthTracker() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-100">Health Tracker</h2>
      <div className="bg-blue-500/10 border border-blue-400/30 rounded-2xl p-8 backdrop-blur">
        <p className="text-blue-200/80 mb-4">
          🚧 <strong>In Development</strong> - Coming Soon
        </p>
        <div className="space-y-4 text-sm text-blue-200/60">
          <p>• Personal health data input (weight, height, age, activity level)</p>
          <p>• Fitness journey tracking with progress charts</p>
          <p>• Nutrition and meal logging</p>
          <p>• Goal setting and achievement monitoring</p>
          <p>• Integration with AI advisor for personalized insights</p>
        </div>
      </div>
    </div>
  );
}

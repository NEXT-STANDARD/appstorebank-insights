interface TechnicalLevelProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function TechnicalLevel({ level, showLabel = true, size = 'md' }: TechnicalLevelProps) {
  const levels = {
    beginner: {
      label: '初級',
      color: 'text-green-600 bg-green-100 border-green-300',
      bars: 1,
      description: '基礎知識があれば理解可能'
    },
    intermediate: {
      label: '中級',
      color: 'text-blue-600 bg-blue-100 border-blue-300',
      bars: 2,
      description: '実務経験が必要'
    },
    advanced: {
      label: '上級',
      color: 'text-orange-600 bg-orange-100 border-orange-300',
      bars: 3,
      description: '専門知識が必要'
    },
    expert: {
      label: 'エキスパート',
      color: 'text-red-600 bg-red-100 border-red-300',
      bars: 4,
      description: '高度な専門知識が必要'
    }
  }

  const currentLevel = levels[level]
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  return (
    <div className="inline-flex items-center space-x-2">
      {/* Level Bars */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`h-4 w-1 rounded-full transition-all ${
              bar <= currentLevel.bars
                ? level === 'beginner' ? 'bg-green-500' :
                  level === 'intermediate' ? 'bg-blue-500' :
                  level === 'advanced' ? 'bg-orange-500' :
                  'bg-red-500'
                : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className={`${currentLevel.color} ${sizeClasses[size]} rounded-full border font-medium`}>
          {currentLevel.label}
        </div>
      )}
      
      {/* Tooltip */}
      <div className="group relative">
        <svg className="w-4 h-4 text-neutral-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10">
          <div className="bg-neutral-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
            {currentLevel.description}
            <div className="absolute top-full left-4 border-4 border-transparent border-t-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  )
}
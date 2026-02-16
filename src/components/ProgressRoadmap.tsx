import { CheckCircle, Circle, Lock } from 'lucide-react';

type Stage = 'mindset' | 'education' | 'investments' | 'schemes' | 'profile';

interface ProgressRoadmapProps {
  currentStage: Stage;
  onStageClick?: (stage: Stage) => void;
}

const stages = [
  { id: 'mindset' as Stage, name: 'Mindset', description: 'Assessment' },
  { id: 'education' as Stage, name: 'Education', description: 'Learn Basics' },
  { id: 'investments' as Stage, name: 'Investments', description: 'Safe Options' },
  { id: 'schemes' as Stage, name: 'Schemes', description: 'Government Plans' },
  { id: 'profile' as Stage, name: 'Profile', description: 'Optimize Setup' },
];

const stageOrder: Stage[] = ['mindset', 'education', 'investments', 'schemes', 'profile'];

function ProgressRoadmap({ currentStage, onStageClick }: ProgressRoadmapProps) {
  const currentIndex = stageOrder.indexOf(currentStage);

  const getStageStatus = (stageId: Stage) => {
    const stageIndex = stageOrder.indexOf(stageId);
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'active';
    return 'locked';
  };

  return (
    <div className="w-full">
      <div className="hidden lg:block">
        <div className="flex items-center justify-between px-8 py-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
            {stages.map((stage, index) => {
              const status = getStageStatus(stage.id);
              const isConnectorLine = index < stages.length - 1;

              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <div
                    className="flex flex-col items-center cursor-pointer transform transition-all duration-300 hover:scale-110"
                    onClick={() => onStageClick?.(stage.id)}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        status === 'completed'
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                          : status === 'active'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-110'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {status === 'completed' ? (
                        <CheckCircle size={24} />
                      ) : status === 'active' ? (
                        <div className="animate-pulse">{index + 1}</div>
                      ) : (
                        <Lock size={20} />
                      )}
                    </div>
                    <div className="mt-3 text-center">
                      <p
                        className={`text-sm font-semibold transition-colors duration-300 ${
                          status === 'active' ? 'text-blue-400' : 'text-slate-300'
                        }`}
                      >
                        {stage.name}
                      </p>
                      <p className="text-xs text-slate-500">{stage.description}</p>
                    </div>
                  </div>

                  {isConnectorLine && (
                    <div className="flex-1 mx-4 h-1 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-8">
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            return (
              <div key={stage.id}>
                <button
                  onClick={() => onStageClick?.(stage.id)}
                  className={`w-full flex items-center p-4 rounded-lg transition-all duration-300 ${
                    status === 'completed'
                      ? 'bg-emerald-500 bg-opacity-20 border border-emerald-500'
                      : status === 'active'
                      ? 'bg-blue-500 bg-opacity-20 border border-blue-500 scale-105'
                      : 'bg-slate-700 bg-opacity-50 border border-slate-600'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                      status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : status === 'active'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-600 text-slate-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <CheckCircle size={20} />
                    ) : status === 'active' ? (
                      <span>{index + 1}</span>
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>
                  <div className="ml-4 text-left flex-1">
                    <p className="font-semibold text-slate-200">{stage.name}</p>
                    <p className="text-sm text-slate-400">{stage.description}</p>
                  </div>
                  {status === 'active' && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </button>
                {index < stages.length - 1 && (
                  <div className="h-6 w-1 bg-slate-700 mx-auto"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressRoadmap;

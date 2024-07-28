import React, { useState, useEffect } from 'react';
import { Sun, Droplet, PlayCircle, PauseCircle, StopCircle, FileText, Save, Download } from 'lucide-react';

const ACTIVITY_TYPES = [
  "Risoluzioni Bug",
  "Coding",
  "Implementazione",
  "Analisi del Progetto",
  "Chiusura e Deploy",
  "Studio Soluzioni",
  "Manutenzione"
];

const DailyReportApp = () => {
  const [step, setStep] = useState(0);
  const [report, setReport] = useState({
    date: new Date().toISOString().split('T')[0],
    employee: '',
    workMode: '',
    startTime: '',
    endTime: '',
    dailyObjectives: '',
    criticalities: '',
    generalNotes: '',
    plannedTasks: [],
    completedTasks: [],
    totalWorkTime: 0,
    totalBreakTime: 0,
  });
  const [currentTask, setCurrentTask] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (isWorking && !isPaused) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWorking, isPaused]);

  useEffect(() => {
    const savedReport = localStorage.getItem('currentReport');
    if (savedReport) {
      setReport(JSON.parse(savedReport));
    }
  }, []);

  const saveReport = () => {
    localStorage.setItem('currentReport', JSON.stringify(report));
  };

  const loadReport = () => {
    const savedReport = localStorage.getItem('currentReport');
    if (savedReport) {
      setReport(JSON.parse(savedReport));
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const addTask = (task) => {
    setReport((prev) => ({
      ...prev,
      plannedTasks: [...prev.plannedTasks, { ...task, id: Date.now() }],
    }));
  };

  const startTask = (task) => {
    setCurrentTask({ ...task, startTime: new Date() });
    setIsWorking(true);
    setIsPaused(false);
    setTimer(0);
    setStep(4);
  };

  const pauseTask = () => {
    setIsPaused(true);
  };

  const resumeTask = () => {
    setIsPaused(false);
  };

  const endTask = () => {
    setIsWorking(false);
    setIsPaused(false);
    const endTime = new Date();
    const taskDuration = Math.floor((endTime - currentTask.startTime) / 1000);
    setReport((prev) => ({
      ...prev,
      completedTasks: [
        ...prev.completedTasks,
        { ...currentTask, endTime, duration: taskDuration },
      ],
      totalWorkTime: prev.totalWorkTime + taskDuration,
    }));
    setCurrentTask(null);
  };

  const startBreak = () => {
    setIsPaused(true);
    setTimer(0);
  };

  const endBreak = () => {
    setReport((prev) => ({
      ...prev,
      totalBreakTime: prev.totalBreakTime + timer,
    }));
    setIsPaused(false);
    setTimer(0);
  };

  const generatePDF = () => {
    console.log('Generating PDF', report);
    // Implementare la generazione del PDF qui
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Rapportino giornaliero Interventi SF System Dev</h2>
            <div className="space-y-2">
              <label className="block">Nome Impiegato:</label>
              <input
                type="text"
                name="employee"
                value={report.employee}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-100 text-gray-800 rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="block">Modalità di lavoro:</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="workMode"
                    value="smartWorking"
                    checked={report.workMode === 'smartWorking'}
                    onChange={handleInputChange}
                    className="form-radio text-orange-500"
                  />
                  <span className="ml-2">Smart Working</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="workMode"
                    value="office"
                    checked={report.workMode === 'office'}
                    onChange={handleInputChange}
                    className="form-radio text-orange-500"
                  />
                  <span className="ml-2">Ufficio</span>
                </label>
              </div>
            </div>
            <button 
              onClick={() => {
                setReport(prev => ({ ...prev, startTime: new Date().toTimeString().split(' ')[0] }));
                setStep(1);
              }} 
              className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
            >
              Inizia Giornata
            </button>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Informazioni Generali</h2>
            <textarea
              name="dailyObjectives"
              value={report.dailyObjectives}
              onChange={handleInputChange}
              placeholder="Obiettivi generali della giornata"
              className="w-full p-2 bg-gray-100 text-gray-800 rounded"
              rows="3"
            />
            <textarea
              name="criticalities"
              value={report.criticalities}
              onChange={handleInputChange}
              placeholder="Criticità"
              className="w-full p-2 bg-gray-100 text-gray-800 rounded"
              rows="3"
            />
            <textarea
              name="generalNotes"
              value={report.generalNotes}
              onChange={handleInputChange}
              placeholder="Note da considerare"
              className="w-full p-2 bg-gray-100 text-gray-800 rounded"
              rows="3"
            />
            <button onClick={() => setStep(2)} className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              Continua
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Pianifica le tue attività per oggi</h2>
            <select
              value={currentTask?.type || ''}
              onChange={(e) => setCurrentTask((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 bg-gray-100 text-gray-800 rounded"
            >
              <option value="">Seleziona tipo di attività</option>
              {ACTIVITY_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Descrizione attività"
              className="w-full p-2 bg-gray-100 text-gray-800 rounded"
              value={currentTask?.description || ''}
              onChange={(e) => setCurrentTask((prev) => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Ore"
                className="w-1/2 p-2 bg-gray-100 text-gray-800 rounded"
                value={currentTask?.estimatedHours || ''}
                onChange={(e) => setCurrentTask((prev) => ({ ...prev, estimatedHours: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Minuti"
                className="w-1/2 p-2 bg-gray-100 text-gray-800 rounded"
                value={currentTask?.estimatedMinutes || ''}
                onChange={(e) => setCurrentTask((prev) => ({ ...prev, estimatedMinutes: e.target.value }))}
              />
            </div>
            <button
              onClick={() => {
                if (currentTask?.type && currentTask?.description) {
                  addTask(currentTask);
                  setCurrentTask(null);
                }
              }}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Aggiungi attività
            </button>
            <button 
              onClick={() => setStep(3)} 
              className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              disabled={report.plannedTasks.length === 0}
            >
              Fine pianificazione
            </button>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Siamo pronti per iniziare le attività?</h2>
            <button
              onClick={() => {
                startTask(report.plannedTasks[0]);
              }}
              className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center"
            >
              <PlayCircle className="mr-2" /> Inizia la prima attività
            </button>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{currentTask ? currentTask.description : 'Attività completata'}</h2>
            {isWorking && !isPaused && (
              <>
                <p className="text-lg">Tempo trascorso: {formatTime(timer)}</p>
                <button onClick={pauseTask} className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition flex items-center justify-center">
                  <PauseCircle className="mr-2" /> Pausa
                </button>
                <button onClick={endTask} className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center justify-center">
                  <StopCircle className="mr-2" /> Termina attività
                </button>
              </>
            )}
            {isPaused && (
              <>
                <p className="text-lg">Pausa: {formatTime(timer)}</p>
                <button onClick={resumeTask} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center">
                  <PlayCircle className="mr-2" /> Riprendi attività
                </button>
                <button onClick={endBreak} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Fine pausa
                </button>
              </>
            )}
            {!isWorking && !isPaused && (
              <>
                <textarea
                  placeholder="Note sull'attività completata"
                  className="w-full p-2 bg-gray-100 text-gray-800 rounded"
                  value={currentTask?.notes || ''}
                  onChange={(e) => setCurrentTask((prev) => ({ ...prev, notes: e.target.value }))}
                />
                <button
                  onClick={() => {
                    const nextTask = report.plannedTasks.find((task) => !report.completedTasks.some((ct) => ct.id === task.id));
                    if (nextTask) {
                      startTask(nextTask);
                    } else {
                      setReport(prev => ({ ...prev, endTime: new Date().toTimeString().split(' ')[0] }));
                      setStep(5);
                    }
                  }}
                  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  {report.plannedTasks.length === report.completedTasks.length + 1 ? 'Termina giornata' : 'Prossima attività'}
                </button>
              </>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Riepilogo giornaliero</h2>
            <div className="bg-gray-100 p-4 rounded text-gray-800">
              <h3 className="text-lg font-semibold mb-2">Informazioni Giornata</h3>
              <p>Data: {report.date}</p>
              <p>Dipendente: {report.employee}</p>
              <p>Modalità di lavoro: {report.workMode}</p>
              <p>Inizio: {report.startTime}</p>
              <p>Fine: {report.endTime}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded text-gray-800">
              <h3 className="text-lg font-semibold mb-2">Obiettivi e Note</h3>
              <p>Obiettivi: {report.dailyObjectives}</p>
              <p>Criticità: {report.criticalities}</p>
              <p>Note generali: {report.generalNotes}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded text-gray-800">
              <h3 className="text-lg font-semibold mb-2">Attività completate</h3>
              {report.completedTasks.map((task, index) => (
                <div key={index} className="mb-2">
                  <p>Tipo: {task.type}</p>
                  <p>Descrizione: {task.description}</p>
                  <p>Durata: {formatTime(task.duration)}</p>
                  <p>Note: {task.notes}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-100 p-4 rounded text-gray-800">
              <h3 className="text-lg font-semibold mb-2">Analisi</h3>
              <p>Tempo totale di lavoro: {formatTime(report.totalWorkTime)}</p>
              <p>Tempo totale di pausa: {formatTime(report.totalBreakTime)}</p>
              <p>Efficienza: {((report.totalWorkTime / (report.totalWorkTime + report.totalBreakTime)) * 100).toFixed(2)}%</p>
            </div>
            <button onClick={generatePDF} className="w-full p-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition flex items-center justify-center">
              <FileText className="mr-2" /> Genera PDF
            </button>
            <button onClick={saveReport} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center justify-center">
              <Save className="mr-2" /> Salva Report
            </button>
            <button onClick={loadReport} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition flex items-center justify-center">
              <Download className="mr-2" /> Carica Report Salvato
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo_solarfertigation.png" alt="SolarFertigation Logo" className="w-full max-w-md" />
        </div>
        <h1 className="text-3xl font-bold mb-6 text-orange-500">Daily Task Tracker</h1>
        {renderStep()}
      </div>
    </div>
  );
};

export default DailyReportApp;
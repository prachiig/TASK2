import React, { useState, useEffect, useCallback } from "react";
import { db, auth } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

const Annotator = () => {
  const [tasks, setTasks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingOCR, setLoadingOCR] = useState(false);

  // Load image list once
  useEffect(() => {
    fetch("/images/data.json")
      .then((res) => res.json())
      .then((data) => {
        // initialize with empty OCR text
        setTasks(data.map((item) => ({ ...item, ocr: null })));
      })
      .catch((err) => console.error("Failed to load tasks:", err));
  }, []);

  const currentTask = tasks[currentIndex];
  const progress = tasks.length
    ? ((currentIndex + 1) / tasks.length) * 100
    : 0;

  // Fetch OCR for current task if not already done
  useEffect(() => {
    const fetchOCR = async () => {
      if (!currentTask || currentTask.ocr !== null) return;

      setLoadingOCR(true);
      try {
        const formData = new FormData();
        const blob = await fetch(currentTask.image).then((r) => r.blob());
        formData.append("file", blob, "image.png");

        const response = await fetch("http://127.0.0.1:5000/ocr", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        setTasks((prev) =>
          prev.map((t, i) =>
            i === currentIndex ? { ...t, ocr: result.ocr_text || "(OCR failed)" } : t
          )
        );
      } catch (err) {
        console.error("OCR error:", err);
        setTasks((prev) =>
          prev.map((t, i) =>
            i === currentIndex ? { ...t, ocr: "(OCR failed)" } : t
          )
        );
      }
      setLoadingOCR(false);
    };

    fetchOCR();
  }, [currentIndex, currentTask]);

  // Save annotation to Firestore
  const saveAnnotation = async (taskId, choice, ocrText) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, "annotations", `${user.uid}_${taskId}`), {
        userId: user.uid,
        taskId,
        choice,
        ocrText,
        timestamp: new Date(),
      });
      console.log("✅ Annotation saved:", choice);
    } catch (err) {
      console.error("❌ Firestore error:", err);
    }
  };

  const handleChoice = (choice) => {
    if (!currentTask) return;
    saveAnnotation(currentTask.id, choice, currentTask.ocr);
    setCurrentIndex((prev) => prev + 1);
  };

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "1") handleChoice("Correct");
      if (event.key === "2") handleChoice("Wrong");
      if (event.key === "3") handleChoice("Skip");
    },
    [currentTask]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!tasks.length) {
    return <p className="p-6 text-center">⏳ Loading tasks...</p>;
  }

  if (currentIndex >= tasks.length) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">✅ All tasks completed!</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold mb-4">OCR Annotation Task</h2>

      <div className="w-full max-w-md bg-gray-100 p-4 rounded shadow-md">
        <img
          src={currentTask.image}
          alt="Word"
          className="w-full h-32 object-contain border mb-4"
        />
        {loadingOCR ? (
          <p className="text-gray-600">⏳ Running OCR...</p>
        ) : (
          <p className="mb-2">
            <strong>OCR Text:</strong>{" "}
            {currentTask.ocr !== null ? currentTask.ocr : "⏳ Pending..."}
          </p>
        )}

        <div className="flex justify-around mt-4">
          <button
            onClick={() => handleChoice("Correct")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={loadingOCR}
          >
            Correct (1)
          </button>
          <button
            onClick={() => handleChoice("Wrong")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={loadingOCR}
          >
            Wrong (2)
          </button>
          <button
            onClick={() => handleChoice("Skip")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            disabled={loadingOCR}
          >
            Skip (3)
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mt-6">
        <div className="bg-gray-300 h-4 rounded">
          <div
            className="bg-blue-500 h-4 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">
          Task {currentIndex + 1} / {tasks.length}
        </p>
      </div>
    </div>
  );
};

export default Annotator;

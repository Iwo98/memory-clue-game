"use client";
import { useState, useCallback } from "react";

interface Circle {
  id: number;
  number: number;
  hint: string;
  position: { top: string; left: string };
  isRevealed: boolean;
}

export default function Home() {
  const sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const hints: Record<number, string> = {
    1: "8|5",
    2: "5|5",
    3: "4|4",
    4: "9|2",
    5: "3|1",
    6: "1|8",
    7: "7|6",
    8: "2|3",
    9: "6|1",
  };
  const [circles, setCircles] = useState<Circle[]>(() => {
    return [...Array(9)].map((_, i) => ({
      id: i + 1,
      number: i + 1,
      hint: hints[i + 1],
      position: getPosition(i),
      isRevealed: i + 1 === sequence[0], // Reveal first number in sequence (3)
    }));
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const handleCircleClick = useCallback(
    (circle: Circle) => {
      if (circle.isRevealed || hasError) return;

      if (circle.number === sequence[currentIndex + 1]) {
        setCircles((prev) =>
          prev.map((c) => (c.id === circle.id ? { ...c, isRevealed: true } : c))
        );
        setCurrentIndex((prev) => prev + 1);
      } else {
        setHasError(true);
      }
    },
    [currentIndex, hasError]
  );

  const resetGame = useCallback(() => {
    setCircles(
      [...Array(9)].map((_, i) => ({
        id: i + 1,
        number: i + 1,
        hint: hints[i + 1],
        position: getPosition(i),
        isRevealed: i + 1 === sequence[0], // Reveal first number in sequence (3)
      }))
    );
    setCurrentIndex(0);
    setHasError(false);
  }, []);

  console.log(currentIndex);
  console.log(sequence.length);

  return (
    <main className="min-h-screen bg-blue-200">
      <div className="relative w-full h-dvh rounded-xl border-6 border-blue-200 bg-white backdrop-blur-sm shadow-xl">
        {circles.map((circle) => (
          <button
            key={circle.id}
            onClick={() => handleCircleClick(circle)}
            style={{
              position: "absolute",
              top: circle.position.top,
              left: circle.position.left,
            }}
            className={`
              w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold
              transition-all duration-300 transform hover:scale-110
              ${
                !circle.isRevealed
                  ? "bg-gradient-to-br from-blue-400 to-purple-400 text-transparent"
                  : ""
              }
              ${
                circle.isRevealed && !hasError
                  ? "bg-gradient-to-br from-green-400 to-teal-400 text-white"
                  : ""
              }
              ${
                hasError
                  ? "bg-gradient-to-br from-red-400 to-pink-400 text-white animate-pulse"
                  : ""
              }
            `}
          >
            {circle.isRevealed && !hasError ? circle.hint : "?"}
          </button>
        ))}

        {hasError && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full
                font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}

        {currentIndex + 1 === sequence.length && (
          <>
            <div className="fixed inset-0 bg-black/20" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-green-200 z-50 w-[75%] max-w-lg">
              <div className="mb-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 text-transparent bg-clip-text mb-3">
                  Gratulacje, wygrałaś!
                </div>
                <div className="text-lg font-normal text-gray-600">
                  Mam nadzieję, że zapisywałaś po drodze kolejność, bo
                  inaczej...
                </div>
              </div>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full
                  font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Zagraj jeszcze raz
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function getPosition(index: number): { top: string; left: string } {
  // Scattered positions around the screen
  const positions = [
    { top: "8%", left: "35%" }, // 1
    { top: "75%", left: "65%" }, // 2
    { top: "45%", left: "8%" }, // 3
    { top: "65%", left: "25%" }, // 4
    { top: "22%", left: "78%" }, // 5
    { top: "52%", left: "55%" }, // 6
    { top: "28%", left: "15%" }, // 7
    { top: "80%", left: "42%" }, // 8
    { top: "12%", left: "62%" }, // 9
  ];
  return positions[index];
}

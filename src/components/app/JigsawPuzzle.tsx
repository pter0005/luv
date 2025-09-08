
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Puzzle, RefreshCw, X } from 'lucide-react';
import Image from 'next/image';

interface JigsawPuzzleProps {
    imageSrc: string;
    onSolved: () => void;
    gridSize?: number;
    title?: string;
    description?: string;
    isPreview?: boolean;
}

interface Piece {
    id: number;
    correctIndex: number;
    currentIndex: number;
    x: number;
    y: number;
    imgX: number;
    imgY: number;
}

export const JigsawPuzzle: React.FC<JigsawPuzzleProps> = ({ 
    imageSrc, 
    onSolved, 
    gridSize = 3,
    title = "Um Quebra-Cabeça Especial",
    description = "Resolva o enigma para revelar a surpresa!",
    isPreview = false,
}) => {
    const [pieces, setPieces] = useState<Piece[]>([]);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [puzzleSize, setPuzzleSize] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showHint, setShowHint] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const pieceSize = puzzleSize / gridSize;

    useEffect(() => {
        const img = new window.Image();
        img.src = imageSrc;
        img.onload = () => {
            const containerWidth = containerRef.current?.offsetWidth || 500;
            const size = Math.min(containerWidth * 0.9, 500);
            setPuzzleSize(size);
            setImageSize({ width: img.width, height: img.height });
            initializePuzzle(size / gridSize, size);
            setIsLoading(false);
        };
    }, [imageSrc, gridSize]);

    const initializePuzzle = (size: number, puzSize: number) => {
        const newPieces: Omit<Piece, 'currentIndex'>[] = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                newPieces.push({
                    id: i * gridSize + j,
                    correctIndex: i * gridSize + j,
                    x: j * size,
                    y: i * size,
                    imgX: j * (imageSize.width / gridSize),
                    imgY: i * (imageSize.height / gridSize),
                });
            }
        }
        
        // Fisher-Yates shuffle
        let shuffled = [...newPieces].map((p, index) => ({...p, currentIndex: index }));
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i].currentIndex, shuffled[j].currentIndex] = [shuffled[j].currentIndex, shuffled[i].currentIndex];
        }

        setPieces(shuffled);
        setIsComplete(false);
    };

    const checkCompletion = (currentPieces: Piece[]) => {
        if (currentPieces.every(p => p.correctIndex === p.currentIndex)) {
            setIsComplete(true);
            if (!isPreview) {
              setTimeout(() => onSolved(), 1500);
            }
        }
    };
    
    const handleDrop = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;

        const newPieces = [...pieces];
        const fromPiece = newPieces.find(p => p.currentIndex === fromIndex)!;
        const toPiece = newPieces.find(p => p.currentIndex === toIndex)!;
        
        [fromPiece.currentIndex, toPiece.currentIndex] = [toPiece.currentIndex, fromPiece.currentIndex];

        setPieces(newPieces);
        checkCompletion(newPieces);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
        setIsDragging(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    
    const handleOnDrop = (e: React.DragEvent<HTMLDivElement>, toIndex: number) => {
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        handleDrop(fromIndex, toIndex);
        setIsDragging(null);
    };
    
    const resetPuzzle = () => {
        initializePuzzle(pieceSize, puzzleSize);
    }
    
    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center bg-black/50 text-white">Carregando quebra-cabeça...</div>;
    }

    return (
        <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-auto">
             <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-4 text-white"
             >
                <h2 className="text-3xl font-bold font-display">{title}</h2>
                <p className="text-muted-foreground">{description}</p>
             </motion.div>
             <div 
                className="relative grid gap-1 bg-card/10 p-1 rounded-lg shadow-2xl" 
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    width: puzzleSize,
                    height: puzzleSize,
                }}
            >
                {pieces.sort((a,b) => a.currentIndex - b.currentIndex).map((piece) => (
                    <motion.div
                        key={piece.id}
                        layoutId={`piece-${piece.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, piece.currentIndex)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleOnDrop(e, piece.currentIndex)}
                        className={`relative cursor-grab rounded-md overflow-hidden transition-all duration-300 ${isDragging === piece.currentIndex ? 'opacity-50 scale-95' : ''}`}
                        style={{ 
                            width: pieceSize, 
                            height: pieceSize,
                        }}
                    >
                         <div
                            className="w-full h-full bg-no-repeat bg-cover"
                            style={{
                                backgroundImage: `url(${imageSrc})`,
                                backgroundSize: `${puzzleSize}px ${puzzleSize}px`,
                                backgroundPosition: `-${piece.x}px -${piece.y}px`,
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10"
                    >
                        <Puzzle className="w-24 h-24 text-green-500 animate-bounce" />
                        <h3 className="text-4xl font-bold text-white mt-4 font-display">Parabéns!</h3>
                        <p className="text-xl text-muted-foreground">Você conseguiu!</p>
                        {isPreview && <Button variant="outline" className="mt-4" onClick={resetPuzzle}>Jogar novamente</Button>}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-4 mt-6">
                <Button onClick={resetPuzzle} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Recomeçar
                </Button>
                <Button onClick={() => setShowHint(p => !p)}>
                    {showHint ? 'Esconder' : 'Ver'} Dica
                </Button>
            </div>
             
             {showHint && (
                <motion.div initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} className="mt-4 relative">
                    <Image src={imageSrc} width={150} height={150} alt="Dica" className="rounded-lg border-4 border-primary/50 opacity-80" />
                     <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7 rounded-full" onClick={() => setShowHint(false)}>
                        <X className="w-4 h-4"/>
                    </Button>
                </motion.div>
             )}
        </div>
    );
};

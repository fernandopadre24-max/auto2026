'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function CalculadoraPage() {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (currentValue === null) {
      setCurrentValue(inputValue);
    } else if (operator) {
      const result = calculate(currentValue, inputValue, operator);
      setCurrentValue(result);
      setDisplay(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (firstOperand: number, secondOperand: number, operator: string) => {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      case '=':
        return secondOperand;
      default:
        return secondOperand;
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setCurrentValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };
  
  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (operator && currentValue !== null) {
        const result = calculate(currentValue, inputValue, operator);
        setDisplay(String(result));
        setCurrentValue(null);
        setOperator(null);
        setWaitingForOperand(true);
    }
  }

  const buttons = [
    { label: '7', action: () => inputDigit('7'), className: "bg-secondary text-secondary-foreground" },
    { label: '8', action: () => inputDigit('8'), className: "bg-secondary text-secondary-foreground" },
    { label: '9', action: () => inputDigit('9'), className: "bg-secondary text-secondary-foreground" },
    { label: '/', action: () => performOperation('/'), className: "bg-primary" },
    { label: '4', action: () => inputDigit('4'), className: "bg-secondary text-secondary-foreground" },
    { label: '5', action: () => inputDigit('5'), className: "bg-secondary text-secondary-foreground" },
    { label: '6', action: () => inputDigit('6'), className: "bg-secondary text-secondary-foreground" },
    { label: '*', action: () => performOperation('*'), className: "bg-primary" },
    { label: '1', action: () => inputDigit('1'), className: "bg-secondary text-secondary-foreground" },
    { label: '2', action: () => inputDigit('2'), className: "bg-secondary text-secondary-foreground" },
    { label: '3', action: () => inputDigit('3'), className: "bg-secondary text-secondary-foreground" },
    { label: '-', action: () => performOperation('-'), className: "bg-primary" },
    { label: '0', action: () => inputDigit('0'), className: "bg-secondary text-secondary-foreground" },
    { label: '.', action: inputDecimal, className: "bg-secondary text-secondary-foreground" },
    { label: 'AC', action: clearAll, className: "bg-destructive text-destructive-foreground" },
    { label: '+', action: () => performOperation('+'), className: "bg-primary" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Calculadora" />
      <div className="flex justify-center">
        <Card className="w-full max-w-xs shadow-2xl">
          <CardContent className="p-4 space-y-4">
            <div className="bg-muted text-muted-foreground rounded-lg p-4 text-right text-4xl font-mono break-all">
              {display}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {buttons.map((btn) => (
                <Button key={btn.label} onClick={btn.action} className={`h-16 text-2xl ${btn.className}`}>
                  {btn.label}
                </Button>
              ))}
            </div>
             <Button onClick={handleEquals} className="w-full h-16 text-2xl bg-accent text-accent-foreground">
                =
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

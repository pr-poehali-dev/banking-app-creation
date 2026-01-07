import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface BankCard {
  id: string;
  name: string;
  balance: number;
  cardNumber: string;
  fullCardNumber: string;
  cardHolder: string;
  expiryDate: string;
  gradient: string;
  currency: string;
}

interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  icon: string;
  type: 'income' | 'expense';
}

const Index = () => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [cards, setCards] = useState<BankCard[]>([
    {
      id: '1',
      name: 'Основная карта',
      balance: 0,
      cardNumber: '**** 4521',
      fullCardNumber: '2200 7012 3456 4521',
      cardHolder: 'IVAN PETROV',
      expiryDate: '12/28',
      gradient: 'linear-gradient(135deg, #9b87f5 0%, #D946EF 100%)',
      currency: '₽'
    },
    {
      id: '2',
      name: 'Сберегательный счёт',
      balance: 0,
      cardNumber: '**** 8932',
      fullCardNumber: '2200 7098 7654 8932',
      cardHolder: 'IVAN PETROV',
      expiryDate: '03/27',
      gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06b6d4 100%)',
      currency: '₽'
    },
    {
      id: '3',
      name: 'Валютный счёт',
      balance: 0,
      cardNumber: '**** 2341',
      fullCardNumber: '4276 8401 2345 2341',
      cardHolder: 'IVAN PETROV',
      expiryDate: '09/29',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      currency: '$'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { toast } = useToast();
  const activeCard = cards[activeCardIndex];

  const formatBalance = (balance: number) => {
    return balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }
    if (!transferRecipient.trim()) {
      toast({ title: 'Ошибка', description: 'Введите получателя', variant: 'destructive' });
      return;
    }
    if (activeCard.balance < amount) {
      toast({ title: 'Ошибка', description: 'Недостаточно средств', variant: 'destructive' });
      return;
    }

    const newCards = [...cards];
    newCards[activeCardIndex].balance -= amount;
    setCards(newCards);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: `Перевод: ${transferRecipient}`,
      amount: -amount,
      date: 'Сейчас',
      category: 'Переводы',
      icon: 'Send',
      type: 'expense'
    };
    setTransactions([newTransaction, ...transactions]);

    toast({ title: 'Успешно!', description: `Переведено ${formatBalance(amount)} ${activeCard.currency}` });
    setShowTransfer(false);
    setTransferAmount('');
    setTransferRecipient('');
  };

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }

    const newCards = [...cards];
    newCards[activeCardIndex].balance += amount;
    setCards(newCards);

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: 'Пополнение счёта',
      amount: amount,
      date: 'Сейчас',
      category: 'Пополнение',
      icon: 'TrendingUp',
      type: 'income'
    };
    setTransactions([newTransaction, ...transactions]);

    toast({ title: 'Успешно!', description: `Пополнено на ${formatBalance(amount)} ${activeCard.currency}` });
    setShowTopUp(false);
    setTopUpAmount('');
  };

  const quickActions = [
    { icon: 'Send', label: 'Перевести', color: 'bg-primary', action: () => setShowTransfer(true) },
    { icon: 'Download', label: 'Пополнить', color: 'bg-secondary', action: () => setShowTopUp(true) },
    { icon: 'QrCode', label: 'QR-код', color: 'bg-accent', action: () => setShowScanner(!showScanner) },
    { icon: 'CreditCard', label: 'Карты', color: 'bg-purple-500', action: () => {} }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pb-24">
      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Привет! 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Управляй своими финансами</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Bell" size={24} />
          </Button>
        </div>

        <div className="space-y-4 animate-scale-in">
          <div 
            className="relative h-60 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
            style={{ background: activeCard.gradient }}
          >
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="relative h-full p-6 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 font-medium">{activeCard.name}</p>
                  <p className="text-lg font-mono font-bold mt-2 tracking-wider">{activeCard.fullCardNumber}</p>
                </div>
                <Icon name="CreditCard" size={32} className="opacity-80" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs opacity-75">Владелец</p>
                    <p className="text-sm font-semibold">{activeCard.cardHolder}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Действует до</p>
                    <p className="text-sm font-semibold">{activeCard.expiryDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-1">Баланс</p>
                  <p className="text-4xl font-bold tracking-tight">
                    {formatBalance(activeCard.balance)} {activeCard.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setActiveCardIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeCardIndex ? 'w-8 bg-primary' : 'w-2 bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 animate-fade-in">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`${action.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                <Icon name={action.icon as any} size={24} className="text-white" />
              </div>
              <span className="text-xs font-medium text-foreground/80">{action.label}</span>
            </button>
          ))}
        </div>

        {showTransfer && (
          <Card className="p-6 animate-scale-in border-2 border-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Перевод денег</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowTransfer(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Получатель</Label>
                <Input 
                  id="recipient" 
                  placeholder="Имя или номер карты" 
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="amount">Сумма ({activeCard.currency})</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="0.00" 
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleTransfer} className="w-full" size="lg">
                <Icon name="Send" size={20} className="mr-2" />
                Перевести
              </Button>
            </div>
          </Card>
        )}

        {showTopUp && (
          <Card className="p-6 animate-scale-in border-2 border-secondary/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Пополнение счёта</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowTopUp(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topUpAmount">Сумма ({activeCard.currency})</Label>
                <Input 
                  id="topUpAmount" 
                  type="number" 
                  placeholder="0.00" 
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleTopUp} className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                <Icon name="Download" size={20} className="mr-2" />
                Пополнить
              </Button>
            </div>
          </Card>
        )}

        {showScanner && (
          <Card className="p-6 animate-scale-in border-2 border-accent/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Сканирование QR-кода</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowScanner(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>
            <div className="bg-muted rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-24 h-24 mx-auto bg-white/50 rounded-2xl flex items-center justify-center">
                  <Icon name="QrCode" size={48} className="text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Наведите камеру на QR-код<br />для автоматической оплаты
                </p>
              </div>
            </div>
          </Card>
        )}

        {transactions.length > 0 && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Последние операции</h2>
              <Button variant="ghost" size="sm" className="text-primary">
                Все <Icon name="ChevronRight" size={16} className="ml-1" />
              </Button>
            </div>

            <div className="space-y-2">
              {transactions.map((transaction) => (
                <Card 
                  key={transaction.id} 
                  className="p-4 hover:shadow-md transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <Icon 
                        name={transaction.icon as any} 
                        size={20} 
                        className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{transaction.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{transaction.date}</span>
                      </div>
                    </div>
                    <div className={`text-right font-bold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-foreground'
                    }`}>
                      <p className="text-lg">
                        {transaction.type === 'income' ? '+' : ''}
                        {formatBalance(transaction.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">{activeCard.currency}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border shadow-2xl">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            {[
              { icon: 'Home', label: 'Главная', active: true },
              { icon: 'ArrowLeftRight', label: 'Переводы', active: false },
              { icon: 'PieChart', label: 'Аналитика', active: false },
              { icon: 'Settings', label: 'Настройки', active: false }
            ].map((item, index) => (
              <button 
                key={index}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  item.active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item.icon as any} size={24} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

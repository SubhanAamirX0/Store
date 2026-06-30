import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { getFinalPrice } from "../data/products.js";
import { formatCurrency } from "../utils/currency.js";
import Button from "./Button.jsx";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="grid gap-4 rounded-lg border border-black/10 bg-white p-4 sm:grid-cols-[96px_1fr_auto] sm:items-center">
      <img className="h-28 w-full rounded-md object-cover sm:h-24" src={item.image} alt={item.name} />
      <div>
        <p className="font-bold">{item.name}</p>
        <p className="text-sm text-black/55">
          {item.color} / {item.size}
        </p>
        <p className="mt-2 font-semibold">{formatCurrency(getFinalPrice(item))}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" className="px-2.5" onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}>
          <Minus size={16} />
        </Button>
        <span className="w-8 text-center font-bold">{item.quantity}</span>
        <Button variant="secondary" className="px-2.5" onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}>
          <Plus size={16} />
        </Button>
        <Button variant="ghost" className="px-2.5 text-rust" onClick={() => removeItem(item.id, item.size, item.color)}>
          <Trash2 size={17} />
        </Button>
      </div>
    </div>
  );
}

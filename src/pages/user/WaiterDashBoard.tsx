import { useEffect, useState } from "react";
import { getAllMenu } from "../../util/menu-util";
import type { MenuModel } from "../../models/MenuModel";
import { useSelector } from "react-redux";
import type { StoreType } from "../../store";
import type { CartModel } from "../../models/CartModel";
import { getCartOfTable, saveOrder } from "../../util/order-util";
import { OrderModel } from "../../models/OrderModel";

const WaiterDashBoard = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState<CartModel[]>([]);
  const user = useSelector((store: StoreType) => store.auth.user);
  useEffect(()=>{
    setCart(getCartOfTable(selectedTable))
  }, [selectedTable])
 
  const filteredMenus = getAllMenu().filter((menu) =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const tables = Array.from({ length: 10 }, (_, i) => ({
    id: `T${String(i + 1).padStart(2, "0")}`,
    name: `Table ${String(i + 1).padStart(2, "0")}`,
  }));

  const addToCart = (menu: MenuModel) => {
    const existingItem = cart.find((item) => item.id === menu.id);
    if (existingItem) {
      setCart((prev) =>
        prev.map((item) => (item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item))
      );
    } else {
      setCart((prev) => [...prev, { ...menu, quantity: 1 }]);
    }
  };

  const updateQuantity = (menuId: string, change: number) => {
    setCart((prev: CartModel[]) => {
      const index = prev.findIndex((item) => item.id === menuId);
      if (index > -1) {
        prev[index].quantity += change;
        if (prev[index].quantity === 0) {
          prev.splice(index, 1);
        }
      }
      return [...prev];
    });
  };

  const removeFromCart = (menuId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== menuId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSaveAndPrint = () => {
    if (cart.length === 0 || !selectedTable) {
      alert("Please select a table and add items to cart");
      return;
    }

    const order = {
      ...new OrderModel(),
      ...{ table: selectedTable, items: cart, total: getTotalAmount(), waiter: user.fullname },
    };

    saveOrder(order);

    const printContent = `
      RESTAURANT RECEIPT
      ==================
      Table: ${selectedTable}
      Waiter: ${user.fullname}
      Date: ${new Date().toLocaleDateString()}
      Time: ${new Date().toLocaleTimeString()}

      ITEMS:
      \t${cart
        .map(
          (item) => `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)}`
        )
        .join("\n\t")}

      TOTAL: ${getTotalAmount().toFixed(2)}

      Thank you for your visit!
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.print();
      printWindow.close();
    }

    setCart([]);
    setSelectedTable("");
    alert("Order saved and receipt printed!");
  };
  return (
    <>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Side - Menu Selection */}
          <div className='space-y-6'>
            {/* Table Selection */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Select Table</h2>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>Choose a table...</option>
                {tables.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Menu Search */}
            <div className='bg-white rounded-lg shadow-md p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Search Menu</h2>
              <input
                type='text'
                placeholder='Search for menu items...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
              />

              <div className='space-y-3'>
                {filteredMenus.map((menu) => (
                  <div
                    key={menu.id}
                    className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'
                  >
                    <div>
                      <h3 className='font-medium text-gray-900'>{menu.name}</h3>
                      <p className='text-sm text-gray-600'>${menu.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => addToCart(menu)}
                      disabled={!selectedTable}
                      className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Cart */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Order for {selectedTable || "No Table Selected"}
            </h2>

            {cart.length === 0 ? (
              <p className='text-gray-500 text-center py-8'>No items in cart</p>
            ) : (
              <div className='space-y-4'>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between p-3 border border-gray-200 rounded-lg'
                  >
                    <div className='flex-1'>
                      <h3 className='font-medium text-gray-900'>{item.name}</h3>
                      <p className='text-sm text-gray-600'>${item.price.toFixed(2)} each</p>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className='w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
                        >
                          -
                        </button>
                        <span className='w-8 text-center font-medium'>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className='w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400'
                        >
                          +
                        </button>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-gray-900'>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className='text-red-600 hover:text-red-800 text-sm'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className='border-t pt-4'>
                  <div className='flex justify-between items-center mb-4'>
                    <span className='text-lg font-semibold text-gray-900'>Total:</span>
                    <span className='text-lg font-bold text-gray-900'>
                      ${getTotalAmount().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleSaveAndPrint}
                    disabled={!selectedTable}
                    className='w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Save & Print Receipt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WaiterDashBoard;
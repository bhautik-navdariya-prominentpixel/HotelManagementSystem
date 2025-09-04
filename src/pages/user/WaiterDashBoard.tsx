import { useState, type ChangeEvent } from "react";
import { getAllMenu } from "../../util/menu-util";
import type { MenuModel } from "../../models/MenuModel";
import { useSelector } from "react-redux";
import type { StoreType } from "../../store";
import { saveOrder } from "../../util/order-util";
import { OrderModel } from "../../models/OrderModel";
import type { TableCartModel } from "../../models/TableCartModel";
import { getTableSize } from "../../util/table-util";

const WaiterDashBoard = () => {
  const tables: TableCartModel[] = Array.from({ length: getTableSize() }, (_, i) => ({
    id: `T${String(i + 1).padStart(2, "0")}`,
    name: `Table ${String(i + 1).padStart(2, "0")}`,
    cart: [],
  }));

  const [selectedTable, setSelectedTable] = useState<TableCartModel[]>(tables);
  const [selectedTableIndex, setSelectedTableIndex] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState("");
  // const [cart, setCart] = useState<CartModel[]>([]);
  const user = useSelector((store: StoreType) => store.auth.user);

  // useEffect(() => {
  //   setCart(getCartOfTable(selectedTable));
  // }, [selectedTable]);

  const filteredMenus = getAllMenu().filter((menu) =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (menu: MenuModel) => {
    const existingItem = selectedTable[selectedTableIndex].cart.find((item) => item.id === menu.id);
    if (existingItem) {
      selectedTable[selectedTableIndex].cart = selectedTable[selectedTableIndex].cart.map((item) =>
        item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
      );
      setSelectedTable([...selectedTable]);
    } else {
      selectedTable[selectedTableIndex].cart = [
        ...selectedTable[selectedTableIndex].cart,
        { ...menu, quantity: 1 },
      ];
      // setCart((prev) => [...prev, { ...menu, quantity: 1 }]);
      setSelectedTable([...selectedTable]);
    }
  };

  const updateQuantity = (menuId: string, change: number) => {
    const index = selectedTable[selectedTableIndex].cart.findIndex((item) => item.id === menuId);
    if (index > -1) {
      selectedTable[selectedTableIndex].cart[index].quantity += change;
      if (selectedTable[selectedTableIndex].cart[index].quantity === 0) {
        selectedTable[selectedTableIndex].cart.splice(index, 1);
      }
    }
    setSelectedTable([...selectedTable]);
    // setSelectedTable((prev: CartModel[]) => {
    //   const index = prev.findIndex((item) => item.id === menuId);
    //   if (index > -1) {
    //     prev[index].quantity += change;
    //     if (prev[index].quantity === 0) {
    //       prev.splice(index, 1);
    //     }
    //   }
    //   return [...prev];
    // });
  };

  const removeFromCart = (menuId: string) => {
    selectedTable[selectedTableIndex].cart = selectedTable[selectedTableIndex].cart.filter(
      (item) => item.id !== menuId
    );
    setSelectedTable([...selectedTable]);
  };

  const getTotalAmount = () => {
    return selectedTable[selectedTableIndex].cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSaveAndPrint = () => {
    if (!selectedTable) {
      alert("Please select a table and add items to cart");
      return;
    }

    const order = {
      ...new OrderModel(),
      ...{
        table: selectedTable[selectedTableIndex].name,
        items: selectedTable[selectedTableIndex].cart,
        total: getTotalAmount(),
        waiter: user.fullname,
      },
    };

    saveOrder(order);

    const printContent = `
      <div style="display: flex; justify-content:center;">
        <pre>
          RESTAURANT RECEIPT
          ==================
          Table: ${selectedTable[selectedTableIndex].name}
          Waiter: ${user.fullname}
          Date: ${new Date().toLocaleDateString()}
          Time: ${new Date().toLocaleTimeString()}

          ITEMS:
          \t${selectedTable[selectedTableIndex].cart
            .map(
              (item) =>
                `${item.name} x ${item.quantity} = ${(item.price * item.quantity).toFixed(2)}`
            )
            .join("\n\t")}

          TOTAL: ${getTotalAmount().toFixed(2)}

          Thank you for your visit!
        </pre>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`);
      printWindow.document.title = "Restorent Recipt";
      printWindow.print();
      printWindow.close();
    }
    selectedTable[selectedTableIndex].cart = [];
    setSelectedTable([...selectedTable]);
    setSelectedTableIndex(-1);
    alert("Order saved and receipt printed!");
  };

  const UpdateSelectedTable = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    const tableName = target.value;
    let index = tables.findIndex((tbl) => tbl.id === tableName);
    console.log(index);

    setSelectedTableIndex(index);
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
                value={selectedTableIndex > -1 ? selectedTable[selectedTableIndex].id : ""}
                onChange={UpdateSelectedTable}
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
                {filteredMenus.length === 0 && (
                  <div className='flex justify-center p-2 text-slate-700'>No Item Found!</div>
                )}
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
                      disabled={selectedTableIndex == -1}
                      className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
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
              Order for{" "}
              {selectedTableIndex > -1
                ? selectedTable[selectedTableIndex].name
                : "No Table Selected"}
            </h2>

            {selectedTableIndex === -1 || selectedTable[selectedTableIndex].cart.length === 0 ? (
              <p className='text-gray-500 text-center py-8'>No items in cart</p>
            ) : (
              <div className='space-y-4'>
                {selectedTable[selectedTableIndex].cart.map((item) => (
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
                          className='w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer'
                        >
                          -
                        </button>
                        <span className='w-8 text-center font-medium'>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className='w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer'
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
                          className='text-red-600 hover:text-red-800 text-sm cursor-pointer'
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
                    className='w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
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

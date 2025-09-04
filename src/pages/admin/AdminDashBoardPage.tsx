import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { MenuModel, MenuModelValidator } from "../../models/MenuModel";
import { useSelector } from "react-redux";
import type { StoreType } from "../../store";
import { useNavigate } from "react-router-dom";
import { addMenu, deleteMenu, getAllMenu, updateMenu } from "../../util/menu-util";
import Header from "../../components/Header";
import {
  getTableSize,
  updateTableSize as updateTableSizeToLocalStorage,
} from "../../util/table-util";

export const AdminDashboard = () => {
  const [menus, setMenus] = useState<MenuModel[]>(getAllMenu());
  const [tableSize, setTableSize] = useState<number>(getTableSize());
  const [editingMenu, setEditingMenu] = useState<MenuModel | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((store: StoreType) => store.auth);
  const navigate = useNavigate();

  const menuFormik = useFormik({
    initialValues: new MenuModel(),
    validationSchema: MenuModelValidator,
    onSubmit: (values: MenuModel, { resetForm }: { resetForm: Function }) => {
      if (editingMenu) {
        updateMenu(values);
        setMenus(getAllMenu());
        setEditingMenu(null);
      } else {
        addMenu(values);
        setMenus(getAllMenu());
      }
      resetForm();
    },
  });

  const handleEdit = (menu: MenuModel) => {
    setEditingMenu(menu);
    menuFormik.setValues({
      id: menu.id,
      name: menu.name,
      price: menu.price,
    });
  };

  const handleDelete = (menuId: string) => {
    deleteMenu(menuId);
    setMenus((prev) => prev.filter((menu) => menu.id !== menuId));
  };

  const handleCancelEdit = () => {
    setEditingMenu(null);
    menuFormik.resetForm();
  };

  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateTableSize = (size: number) => {
    if (tableSize === 0 && size < 0) return;
    updateTableSizeToLocalStorage(size);
    setTableSize((prev) => prev + size);
  };

  useEffect(() => {
    if (!user.login || !user.user.isAdmin) {
      navigate("/");
    }
  }, []);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <Header type='ADMIN' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-2'>
          <div className='bg-white rounded-lg shadow-md p-6 mb-8 col-span-10'>
            <h2 className='text-lg font-semibold text-gray-900 mb-6'>
              {editingMenu ? "Edit Menu Item" : "Add New Menu Item"}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 col-span-10'>
              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
                  Menu Name
                </label>
                <input
                  id='name'
                  type='text'
                  {...menuFormik.getFieldProps("name")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    menuFormik.touched.name && menuFormik.errors.name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder='Enter menu name'
                />
                {menuFormik.touched.name && menuFormik.errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{menuFormik.errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-2'>
                  Price ($)
                </label>
                <input
                  id='price'
                  type='number'
                  step='0.01'
                  {...menuFormik.getFieldProps("price")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    menuFormik.touched.price && menuFormik.errors.price
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder='Enter price'
                />
                {menuFormik.touched.price && menuFormik.errors.price && (
                  <p className='mt-1 text-sm text-red-600'>{menuFormik.errors.price}</p>
                )}
              </div>
              <br />
              <div className='flex items-center gap-2 flex-row-reverse'>
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    menuFormik.handleSubmit();
                  }}
                  className='bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer'
                >
                  {editingMenu ? "Update" : "Add Menu"}
                </button>
                {editingMenu && (
                  <button
                    type='button'
                    onClick={handleCancelEdit}
                    className='bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer'
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className='col-span-2 bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center justify-center gap-2'>
            <h2 className='text-lg font-semibold text-gray-900 mb-6'>Table Size</h2>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center space-x-2'>
                <button
                  onClick={() => updateTableSize(-1)}
                  className='w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer'
                >
                  -
                </button>
                <span className='w-8 text-center font-medium'>{tableSize}</span>
                <button
                  onClick={() => updateTableSize(1)}
                  className='w-8 h-8 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer'
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Menu Form */}

        {/* Menu Table */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-lg font-semibold text-gray-900'>Menu Items</h2>
            <div className='w-64'>
              <input
                type='text'
                placeholder='Search menus...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Menu Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Price
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredMenus.length === 0 ? (
                  <tr>
                    <td colSpan={3} className='px-6 py-4 text-center text-gray-500'>
                      {searchTerm
                        ? "No menus found matching your search"
                        : "No menu items available"}
                    </td>
                  </tr>
                ) : (
                  filteredMenus.map((menu) => (
                    <tr key={menu.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {menu.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ${menu.price.toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2'>
                        <button
                          onClick={() => handleEdit(menu)}
                          className='text-blue-600 hover:text-blue-900 font-medium cursor-pointer'
                        >
                          Edit
                        </button>
                        <button
                          disabled={!!editingMenu}
                          onClick={() => handleDelete(menu.id)}
                          className='text-red-600 hover:text-red-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

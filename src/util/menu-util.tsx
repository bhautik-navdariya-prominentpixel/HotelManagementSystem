import type { MenuModel } from "../models/MenuModel";
const KEY = "menu";
export function getAllMenu(): MenuModel[] {
  return JSON.parse(localStorage.getItem(KEY) ?? "[]");
}

export function addMenu(menu: MenuModel) {
  const allMenu = getAllMenu();
  if (
    !allMenu.some(
      (lcoalMenu) => lcoalMenu.name.trim().toLowerCase() == menu.name.trim().toLocaleLowerCase()
    )
  ) {
    allMenu.push({ ...menu, id: Math.random().toString(), name: menu.name.trim() });
    localStorage.setItem(KEY, JSON.stringify(allMenu));
  }
}

export function updateMenu(menu: MenuModel) {
  const allMenu = getAllMenu();
  if (
    allMenu.some(
      (lcoalMenu) => lcoalMenu.name.trim().toLowerCase() == menu.name.trim().toLocaleLowerCase() && lcoalMenu.id !== menu.id
    )
  ) {
    return;
  }
  const index = allMenu.findIndex((m) => m.id === menu.id);
  if (index > -1) {
    allMenu[index] = menu;
  }
  localStorage.setItem(KEY, JSON.stringify(allMenu));
}

export function deleteMenu(id: string) {
  const allMenu = getAllMenu().filter((m) => m.id !== id);
  localStorage.setItem(KEY, JSON.stringify(allMenu));
}

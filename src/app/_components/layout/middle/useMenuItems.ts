import {
  MenuItemType,
  useMenuItems as getMenuItems,
} from '@/utils/constants/menu';

interface UseMenuItemsProps {
  firstName: string;
  lastName: string;
  setCurrentPage: (key: string) => void;
  onUserInfoClick: () => void;
}

function injectUserName(
  items: MenuItemType[],
  userName: string,
  setCurrentPage: (key: string) => void,
  onUserInfoClick: () => void,
): MenuItemType[] {
  return items.map((item) => {
    if (item.type === 'group' && item.children) {
      return {
        ...item,
        children: injectUserName(
          item.children,
          userName,
          setCurrentPage,
          onUserInfoClick,
        ),
      };
    }
    if (item.key === 'user-info') {
      return {
        ...item,
        label: userName,
        onClick: onUserInfoClick,
      };
    }
    if (!item.type) {
      return { ...item, onClick: () => setCurrentPage(item.key) };
    }
    return item;
  });
}

export default function useMenuItems({
  firstName,
  lastName,
  setCurrentPage,
  onUserInfoClick,
}: UseMenuItemsProps): MenuItemType[] {
  const userName = [firstName, lastName].filter(Boolean).join(' ');
  return injectUserName(
    getMenuItems(firstName, lastName),
    userName,
    setCurrentPage,
    onUserInfoClick,
  );
}

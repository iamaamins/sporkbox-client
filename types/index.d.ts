export interface IMobileMenu {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

export type FormEvent = React.FormEvent<HTMLFormElement>;

export interface IAdmin {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export interface IContextProvider {
  children: React.ReactNode;
}

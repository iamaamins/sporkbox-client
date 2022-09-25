export interface IMobileNav {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IMobileMenu {
  isOpen: boolean;
}

export type ChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

export type FormEvent = React.FormEvent<HTMLFormElement>;
export type SetState = React.Dispatch<React.SetStateAction<boolean>>;

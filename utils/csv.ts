import { ICSVData, ICompany, ICustomer, IOrdersGroup } from "types";
import { convertDateToText, formatCurrencyToUSD } from "@utils/index";

// Order headers
export const orderHeaders = [
  {
    label: "Delivery date",
    key: "deliveryDate",
  },
  {
    label: "Company",
    key: "companyName",
  },
  {
    label: "Shift",
    key: "shift",
  },
  {
    label: "First name",
    key: "firstName",
  },
  {
    label: "Last name",
    key: "lastName",
  },
  {
    label: "Email",
    key: "customerEmail",
  },
  {
    label: "Restaurant",
    key: "restaurantName",
  },
  {
    label: "Item",
    key: "itemName",
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Dietary Tags",
    key: "tags",
  },
  {
    label: "Added ingredients",
    key: "addedIngredients",
  },
  {
    label: "Removed ingredients",
    key: "removedIngredients",
  },
  {
    label: "Description",
    key: "description",
  },
  {
    label: "Price",
    key: "price",
  },
];

// Order file name
export const orderFileName = (ordersGroup: IOrdersGroup) =>
  `${ordersGroup.company.name} - ${ordersGroup.deliveryDate.split("T")[0]}.csv`;

// Order data
export const orderData = (ordersGroup: IOrdersGroup) =>
  ordersGroup.orders
    .map((order) => ({
      tags: order.item.tags,
      price: order.item.total,
      itemName: order.item.name,
      quantity: order.item.quantity,
      companyName: order.company.name,
      lastName: order.customer.lastName,
      customerEmail: order.customer.email,
      description: order.item.description,
      firstName: order.customer.firstName,
      restaurantName: order.restaurant.name,
      addedIngredients: order.item.addedIngredients,
      removedIngredients: order.item.removedIngredients,
      deliveryDate: convertDateToText(order.delivery.date),
      shift: `${order.company.shift[0].toUpperCase()}${order.company.shift.slice(
        1
      )}`,
    }))
    .reduce((acc, curr) => {
      if (curr.quantity === 1) {
        // Format price and add curr order to acc
        return [...acc, { ...curr, price: formatCurrencyToUSD(curr.price) }];
      } else {
        // Create orders array
        let orders = [];

        // Loop through quantity, create an order
        // for each quantity and add the item to the orders array
        for (let i = 0; i < curr.quantity; i++) {
          orders.push({
            ...curr,
            quantity: 1,
            price: formatCurrencyToUSD(curr.price / curr.quantity),
          });
        }

        // Return the acc with created orders
        return [...acc, ...orders];
      }
    }, [] as ICSVData[]);

// Customer header
export const customerHeaders = [
  {
    label: "First Name",
    key: "firstName",
  },
  {
    label: "Last Name",
    key: "lastName",
  },
  {
    label: "Email",
    key: "email",
  },
  {
    label: "Status",
    key: "status",
  },
];

// Customer file name
export const customerFileName = (company: ICompany) =>
  `Customer info - ${
    company.name
  } - ${company.shift[0].toUpperCase()}${company.shift.slice(1)} shift`;

// Customer data
export const customerData = (customers: ICustomer[]) =>
  customers.map((customer) => ({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    status: customer.status,
  }));

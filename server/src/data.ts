export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
}

export let customers: Customer[] = [
  { id: 1, name: "Max Mustermann", email: "max@example.com", phone: "0123456789" },
  { id: 2, name: "Anna Beispiel", email: "anna@example.com" },
];

export const getCustomers = () => customers;
export const getCustomerById = (id: number) => customers.find(c => c.id === id);
export const addCustomer = (customer: Customer) => {
  customers.push(customer);
};
export const updateCustomer = (id: number, updated: Partial<Customer>) => {
  const index = customers.findIndex(c => c.id === id);
  if (index !== -1) {
    customers[index] = { ...customers[index], ...updated };
  }
};
export const deleteCustomer = (id: number) => {
  customers = customers.filter(c => c.id !== id);
};

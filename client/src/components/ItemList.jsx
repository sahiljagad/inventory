/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Item = (props) => (
  <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
    <td className='p-4 align-middle [&amp;:has([role=checkbox])]:pr-0'>
      {props.item.name}
    </td>
    <td className='p-4 align-middle [&amp;:has([role=checkbox])]:pr-0'>
      {props.item.quantity}
    </td>
    <td className='p-4 align-middle [&amp;:has([role=checkbox])]:pr-0'>
      <div className='flex gap-2'>
        <Link
          className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3'
          to={`/edit/${props.item._id}`}
        >
          Edit
        </Link>
        <button
          className='inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3'
          color='red'
          type='button'
          onClick={() => {
            props.deleteItem(props.item._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function ItemList() {
  const [items, setItems] = useState([]);

  // This method fetches the items from the database.
  useEffect(() => {
    async function getItems() {
      const response = await fetch(`http://localhost:5050/item/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const items = await response.json();
      setItems(items);
    }
    getItems();
    return;
  }, [items.length]);

  // This method will delete a item
  async function deleteItem(id) {
    await fetch(`http://localhost:5050/item/${id}`, {
      method: "DELETE",
    });
    const newItems = items.filter((el) => el._id !== id);
    setItems(newItems);
  }

  // This method will map out the items on the table
  function itemList() {
    return items.map((item) => {
      return (
        <Item
          item={item}
          deleteItem={() => deleteItem(item._id)}
          key={item._id}
        />
      );
    });
  }

  // This following section will display the table with the items.
  return (
    <>
      <h3 className='text-lg font-semibold p-4'>Apt 602 Inventory</h3>
      <div className='border rounded-lg overflow-hidden'>
        <div className='relative w-full overflow-auto'>
          <table className='w-full caption-bottom text-sm'>
            <thead className='[&amp;_tr]:border-b'>
              <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0'>
                  Name
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0'>
                  Quantity
                </th>
                <th className='h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='[&amp;_tr:last-child]:border-0'>
              {itemList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

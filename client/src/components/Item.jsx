import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Item() {
  const [form, setForm] = useState({
    name: "",
    quantity: 0,
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if (!id) {
        setForm({
          name: "",
          quantity: 0,
        });
        return;
      }
      setIsNew(false);
      const response = await fetch(
        `http://localhost:5050/item/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const item = await response.json();
      if (!item) {
        console.warn(`Item with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(item);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();
    const obj = { ...form };
    try {
      let response;
      if (isNew) {
        // if we are adding a new item we will POST to /item.
        response = await fetch("http://localhost:5050/item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        });
      } else {
        // if we are updating a item we will PATCH to /item/:id.
        response = await fetch(`http://localhost:5050/item/${params.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("A problem occurred with your fetch operation: ", error);
    } finally {
      setForm({ name: "", quantity: 0 });
      navigate("/");
    }
  }

  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className='text-lg font-semibold p-4'>Create/Update Item Record</h3>
      <form
        onSubmit={onSubmit}
        className='border rounded-lg overflow-hidden p-4'
      >
        <div className='grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2'>
          <div>
            <h2 className='text-base font-semibold leading-7 text-slate-900'>
              Item Info
            </h2>
          </div>

          <div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 '>
            <div className='sm:col-span-4'>
              <label
                htmlFor='name'
                className='block text-sm font-medium leading-6 text-slate-900'
              >
                Name
              </label>
              <div className='mt-2'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder=''
                    value={form.name}
                    onChange={(e) => updateForm({ name: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className='sm:col-span-4'>
              <label
                htmlFor='quantity'
                className='block text-sm font-medium leading-6 text-slate-900'
              >
                Quantity
              </label>
              <div className='mt-2'>
                <div className='flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md'>
                  <input
                    type='number'
                    name='quantity'
                    id='quantity'
                    className='block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6'
                    placeholder='Developer Advocate'
                    value={form.quantity}
                    onChange={(e) => updateForm({ quantity: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <input
          type='submit'
          value='Save Item Info'
          className='inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4'
        />
      </form>
    </>
  );
}

// app/routes/master-entry.tsx
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { 
  updateMasterEntry, 
  getLatestMasterEntry,
  getMasterEntryById,
  listMasterEntries,
  createOrUpdateMasterEntry
} from "~/data/masterEntry.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const latestEntry = await getMasterEntryById(1);

    if (!latestEntry) {
      const defaultEntry = await createOrUpdateMasterEntry({
        id: 1,
        gold_16c: 0, // Use gold_16c
        gold_18c: 0, // Use gold_18c
        gold_22c: 0, // Use gold_22c
        gold_24c: 0, // Use gold_24c
        silver_pure: 0,
        silver_ornamental: 0,
        remarks: null
      });

      return json({ 
        entry: {
          id: 1,
          gold_16c: '0', // Use gold_16c
          gold_18c: '0', // Use gold_18c
          gold_22c: '0', // Use gold_22c
          gold_24c: '0', // Use gold_24c
          silver_pure: '0',
          silver_ornamental: '0',
          remarks: null
        }
      });
    }

    return json({ 
      entry: {
        id: 1,
        gold_16c: latestEntry.gold_16c?.toString() || '0', // Use gold_16c
        gold_18c: latestEntry.gold_18c?.toString() || '0', // Use gold_18c
        gold_22c: latestEntry.gold_22c?.toString() || '0', // Use gold_22c
        gold_24c: latestEntry.gold_24c?.toString() || '0', // Use gold_24c
        silver_pure: latestEntry.silver_pure?.toString() || '0',
        silver_ornamental: latestEntry.silver_ornamental?.toString() || '0',
        remarks: latestEntry.remarks || null
      }
    });
  } catch (error) {
    console.error('Loader Error:', error);
    return json({ 
      entry: {
        id: 1,
        gold_16c: '0', // Use gold_16c
        gold_18c: '0', // Use gold_18c
        gold_22c: '0', // Use gold_22c
        gold_24c: '0', // Use gold_24c
        silver_pure: '0',
        silver_ornamental: '0',
        remarks: null
      }
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  try {
    switch (intent) {
      case 'create':
      case 'update': {
        const updatedEntry = await createOrUpdateMasterEntry({
          id: 1,
          gold_16c: Number(formData.get('gold_16c')), // Use gold_16c
          gold_18c: Number(formData.get('gold_18c')), // Use gold_18c
          gold_22c: Number(formData.get('gold_22c')), // Use gold_22c
          gold_24c: Number(formData.get('gold_24c')), // Use gold_24c
          silver_pure: Number(formData.get('silver_pure')),
          silver_ornamental: Number(formData.get('silver_ornamental')),
          remarks: formData.get('remarks')?.toString() || null
        });

        return json({ 
          success: true, 
          entry: {
            id: 1,
            gold_16c: updatedEntry.gold_16c?.toString() || '0', // Use gold_16c
            gold_18c: updatedEntry.gold_18c?.toString() || '0', // Use gold_18c
            gold_22c: updatedEntry.gold_22c?.toString() || '0', // Use gold_22c
            gold_24c: updatedEntry.gold_24c?.toString() || '0', // Use gold_24c
            silver_pure: updatedEntry.silver_pure?.toString() || '0',
            silver_ornamental: updatedEntry.silver_ornamental?.toString() || '0',
            remarks: updatedEntry.remarks || null
          }
        });
      }
      default:
        return json({ error: 'Invalid intent' }, { status: 400 });
    }
  } catch (error) {
    console.error('Master Entry Action Error:', error);
    return json({ error: 'Failed to process master entry' }, { status: 500 });
  }
}

export default function MasterEntryPage() {
  const { entry } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  return (
    <div className="container mx-auto p-4">
      <Form method="POST">
        <input type="hidden" name="intent" value={entry?.id ? 'update' : 'create'} />
        {entry?.id && <input type="hidden" name="id" value={entry.id} />}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'gold_16c', 'gold_18c', 'gold_22c', 'gold_24c', 
            'silver_pure', 'silver_ornamental'
          ].map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block mb-2">
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              <input
                type="number"
                id={key}
                name={key}
                step="0.01"
                defaultValue={entry?.[key as keyof typeof entry] || '0'}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label htmlFor="remarks" className="block mb-2">Remarks</label>
          <textarea
            id="remarks"
            name="remarks"
            defaultValue={entry?.remarks || ''}
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        <button 
          type="submit" 
          disabled={navigation.state === 'submitting'}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {entry?.id ? 'Update Entry' : 'Create Entry'}
        </button>
      </Form>
    </div>
  );
}
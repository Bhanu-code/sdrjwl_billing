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
      // Always attempt to get entry by ID 1
      const latestEntry = await getMasterEntryById(1);
      
      console.log('Loader Fetched Entry:', latestEntry);
  
      // If no entry exists, create a default entry
      if (!latestEntry) {
        const defaultEntry = await createOrUpdateMasterEntry({
          id: 1,
          gold_16k: 0,
          gold_18k: 0,
          gold_22k: 0,
          gold_24k: 0,
          silver_pure: 0,
          silver_ornamental: 0,
          remarks: null
        });
  
        return json({ 
          entry: {
            id: 1,
            gold_16k: '0',
            gold_18k: '0',
            gold_22k: '0',
            gold_24k: '0',
            silver_pure: '0',
            silver_ornamental: '0',
            remarks: null
          }
        });
      }
  
      // Transform the entry for frontend
      return json({ 
        entry: {
          id: 1,
          gold_16k: latestEntry.gold_16c?.toString() || '0',
          gold_18k: latestEntry.gold_18c?.toString() || '0',
          gold_22k: latestEntry.gold_22c?.toString() || '0',
          gold_24k: latestEntry.gold_24c?.toString() || '0',
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
          gold_16k: '0',
          gold_18k: '0',
          gold_22k: '0',
          gold_24k: '0',
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
            id: 1,  // Always use ID 1
            gold_16k: Number(formData.get('gold_16k')),
            gold_18k: Number(formData.get('gold_18k')),
            gold_22k: Number(formData.get('gold_22k')),
            gold_24k: Number(formData.get('gold_24k')),
            silver_pure: Number(formData.get('silver_pure')),
            silver_ornamental: Number(formData.get('silver_ornamental')),
            remarks: formData.get('remarks')?.toString() || null
          });
  
          return json({ 
            success: true, 
            entry: {
              id: 1,
              gold_16k: updatedEntry.gold_16c?.toString() || '0',
              gold_18k: updatedEntry.gold_18c?.toString() || '0',
              gold_22k: updatedEntry.gold_22c?.toString() || '0',
              gold_24k: updatedEntry.gold_24c?.toString() || '0',
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
            'gold_16k', 'gold_18k', 'gold_22k', 'gold_24k', 
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
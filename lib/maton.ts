/**
 * Maverick · Maton AI Bridge
 * Gives Maverick "hands" — executes strategies directly into SaaS tools.
 * Supports: HubSpot, Klaviyo, Salesforce, Slack, Google Sheets, Notion, Shopify + 40 more.
 */

export interface MatonAction {
  app: string;
  action: string;
  params: Record<string, unknown>;
}

export interface MatonResult {
  success: boolean;
  data?: unknown;
  error?: string;
  executedAt: string;
}

// All supported app/action pairs from Maton
export const MATON_INTEGRATIONS = [
  { app: 'hubspot',       label: 'HubSpot',         actions: ['create-contact', 'update-contact', 'create-deal', 'list-contacts'] },
  { app: 'klaviyo',       label: 'Klaviyo',          actions: ['create-campaign', 'create-template', 'add-profiles-to-list', 'send-campaign'] },
  { app: 'salesforce',    label: 'Salesforce',       actions: ['create-contact', 'get-contact', 'list-contacts'] },
  { app: 'slack',         label: 'Slack',            actions: ['send-message', 'list-channels'] },
  { app: 'notion',        label: 'Notion',           actions: ['create-page', 'find-page'] },
  { app: 'google-sheet',  label: 'Google Sheets',    actions: ['add-multiple-rows', 'create-spreadsheet', 'update-row'] },
  { app: 'google-mail',   label: 'Gmail',            actions: ['create-draft', 'send-email'] },
  { app: 'shopify',       label: 'Shopify',          actions: ['list-orders', 'get-order'] },
  { app: 'stripe',        label: 'Stripe',           actions: ['list-customers', 'get-invoice'] },
  { app: 'asana',         label: 'Asana',            actions: ['create-task', 'list-tasks'] },
  { app: 'airtable',      label: 'Airtable',         actions: ['list-records', 'list-bases'] },
  { app: 'google-docs',   label: 'Google Docs',      actions: ['create-document', 'append-text'] },
];

// Suggested post-synapse actions for each Maverick module
export const SUGGESTED_MATON_ACTIONS: Record<string, { app: string; action: string; label: string; description: string }[]> = {
  'ad-copy-synapse': [
    { app: 'notion',      action: 'create-page',    label: 'Save to Notion',     description: 'Save this ad copy as a Notion page' },
    { app: 'google-docs', action: 'create-document', label: 'Export to Docs',    description: 'Export to Google Docs for team review' },
    { app: 'slack',       action: 'send-message',   label: 'Share to Slack',     description: 'Send to creative team Slack channel' },
  ],
  'aeo-synapse': [
    { app: 'google-docs', action: 'create-document', label: 'Export AEO Brief',  description: 'Export AEO strategy to Google Docs' },
    { app: 'notion',      action: 'create-page',    label: 'Save to Notion',     description: 'Archive AEO brief in Notion' },
    { app: 'asana',       action: 'create-task',    label: 'Create Asana Task',  description: 'Assign AEO implementation as a task' },
  ],
  'roas-recovery': [
    { app: 'slack',       action: 'send-message',   label: 'Alert Team',         description: 'Send ROAS recovery plan to Slack' },
    { app: 'hubspot',     action: 'create-deal',    label: 'Log in HubSpot',     description: 'Create a recovery deal in HubSpot' },
    { app: 'google-sheet', action: 'add-multiple-rows', label: 'Log to Sheets', description: 'Append pivot actions to performance sheet' },
  ],
  'offer-math': [
    { app: 'google-sheet', action: 'create-spreadsheet', label: 'Export Offer Math', description: 'Build an offer calculation sheet' },
    { app: 'notion',      action: 'create-page',    label: 'Save to Notion',     description: 'Archive offer framework in Notion' },
  ],
  'lead-gen-elite': [
    { app: 'hubspot',     action: 'create-contact', label: 'Add to HubSpot',     description: 'Create a lead pipeline entry in HubSpot' },
    { app: 'klaviyo',     action: 'add-profiles-to-list', label: 'Add to Klaviyo', description: 'Push to Klaviyo lead nurture list' },
  ],
  default: [
    { app: 'notion',      action: 'create-page',    label: 'Save to Notion',     description: 'Archive this synapse in Notion' },
    { app: 'slack',       action: 'send-message',   label: 'Share to Slack',     description: 'Send to your team on Slack' },
    { app: 'google-docs', action: 'create-document', label: 'Export to Docs',    description: 'Export to Google Docs' },
  ],
};

export async function executeMatonAction(
  matonApiKey: string,
  action: MatonAction
): Promise<MatonResult> {
  try {
    const res = await fetch(`https://api.maton.ai/v1/actions/${action.app}/${action.action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${matonApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action.params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      return { success: false, error: err.message || 'Maton action failed', executedAt: new Date().toISOString() };
    }

    const data = await res.json();
    return { success: true, data, executedAt: new Date().toISOString() };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error', executedAt: new Date().toISOString() };
  }
}

export async function getMatonConnections(matonApiKey: string): Promise<string[]> {
  try {
    const res = await fetch('https://api.maton.ai/v1/connections', {
      headers: { 'Authorization': `Bearer ${matonApiKey}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.connections?.map((c: { app: string }) => c.app) ?? [];
  } catch {
    return [];
  }
}

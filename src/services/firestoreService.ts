import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase.ts';
import { InvoiceData, BusinessDetails, CustomerDetails } from '../types/invoice.ts';

export interface SavedCustomerRecord extends CustomerDetails {
  id: string;
  totalBilled?: number;
  invoiceCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserBusinessProfile extends Partial<BusinessDetails> {
  businessName: string;
  defaultCurrency?: string;
  defaultPaymentTerms?: string;
  defaultTemplate?: string;
  paymentInstructions?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumberOrSwift?: string;
  updatedAt?: string;
}

// 1. User Profile Management
export async function saveUserProfile(uid: string, profileData: { email: string; displayName?: string; photoURL?: string }) {
  const path = `users/${uid}`;
  try {
    await setDoc(doc(db, 'users', uid), {
      uid,
      email: profileData.email,
      displayName: profileData.displayName || '',
      photoURL: profileData.photoURL || '',
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2. Business Profile Management
export async function getBusinessProfile(uid: string): Promise<UserBusinessProfile | null> {
  const path = `users/${uid}/settings/businessProfile`;
  try {
    const snap = await getDoc(doc(db, 'users', uid, 'settings', 'businessProfile'));
    if (snap.exists()) {
      return snap.data() as UserBusinessProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveBusinessProfile(uid: string, profile: UserBusinessProfile): Promise<void> {
  const path = `users/${uid}/settings/businessProfile`;
  try {
    await setDoc(doc(db, 'users', uid, 'settings', 'businessProfile'), {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 3. User Invoices Management
export async function getUserInvoices(uid: string): Promise<InvoiceData[]> {
  const path = `users/${uid}/invoices`;
  try {
    const q = query(collection(db, 'users', uid, 'invoices'), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InvoiceData));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveUserInvoice(uid: string, invoice: InvoiceData): Promise<void> {
  const invoiceId = invoice.id || `inv_${Date.now()}`;
  const path = `users/${uid}/invoices/${invoiceId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'invoices', invoiceId), {
      ...invoice,
      id: invoiceId,
      userId: uid,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteUserInvoice(uid: string, invoiceId: string): Promise<void> {
  const path = `users/${uid}/invoices/${invoiceId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'invoices', invoiceId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function updateUserInvoiceStatus(uid: string, invoiceId: string, status: InvoiceData['status']): Promise<void> {
  const path = `users/${uid}/invoices/${invoiceId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'invoices', invoiceId), {
      status,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 4. User Drafts Management (Debounced Autosave target)
export async function getUserDrafts(uid: string): Promise<InvoiceData[]> {
  const path = `users/${uid}/drafts`;
  try {
    const q = query(collection(db, 'users', uid, 'drafts'), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as InvoiceData));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveUserDraft(uid: string, draft: InvoiceData): Promise<void> {
  const draftId = draft.id || `draft_${Date.now()}`;
  const path = `users/${uid}/drafts/${draftId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'drafts', draftId), {
      ...draft,
      id: draftId,
      userId: uid,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteUserDraft(uid: string, draftId: string): Promise<void> {
  const path = `users/${uid}/drafts/${draftId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'drafts', draftId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 5. User Customers Management
export async function getUserCustomers(uid: string): Promise<SavedCustomerRecord[]> {
  const path = `users/${uid}/customers`;
  try {
    const q = query(collection(db, 'users', uid, 'customers'), orderBy('updatedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SavedCustomerRecord));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveUserCustomer(uid: string, customer: CustomerDetails, idOverride?: string): Promise<string> {
  const customerId = idOverride || customer.id || `cust_${Date.now()}`;
  const path = `users/${uid}/customers/${customerId}`;
  try {
    await setDoc(doc(db, 'users', uid, 'customers', customerId), {
      ...customer,
      id: customerId,
      userId: uid,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }, { merge: true });
    return customerId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return customerId;
  }
}

export async function deleteUserCustomer(uid: string, customerId: string): Promise<void> {
  const path = `users/${uid}/customers/${customerId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'customers', customerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 6. Complete Data Export (GDPR / Data Privacy requirement)
export async function exportAllUserData(uid: string) {
  const [invoices, drafts, customers, profile] = await Promise.all([
    getUserInvoices(uid),
    getUserDrafts(uid),
    getUserCustomers(uid),
    getBusinessProfile(uid),
  ]);

  return {
    exportDate: new Date().toISOString(),
    userId: uid,
    businessProfile: profile,
    invoices,
    drafts,
    customers,
  };
}

// 7. Complete Account Data Deletion (GDPR Right to Erasure)
export async function deleteAllUserData(uid: string): Promise<void> {
  const [invoices, drafts, customers] = await Promise.all([
    getUserInvoices(uid),
    getUserDrafts(uid),
    getUserCustomers(uid),
  ]);

  // Delete all invoices
  for (const inv of invoices) {
    if (inv.id) await deleteUserInvoice(uid, inv.id);
  }
  // Delete all drafts
  for (const draft of drafts) {
    if (draft.id) await deleteUserDraft(uid, draft.id);
  }
  // Delete all customers
  for (const cust of customers) {
    if (cust.id) await deleteUserCustomer(uid, cust.id);
  }
  // Delete business settings
  try {
    await deleteDoc(doc(db, 'users', uid, 'settings', 'businessProfile'));
  } catch (e) {
    console.warn('No business profile to delete', e);
  }
  // Delete user root document
  try {
    await deleteDoc(doc(db, 'users', uid));
  } catch (e) {
    console.warn('No root user document to delete', e);
  }
}

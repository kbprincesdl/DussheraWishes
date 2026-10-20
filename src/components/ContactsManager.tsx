import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Edit3, 
  Trash2, 
  Sparkles, 
  MessageCircle, 
  Check, 
  X,
  Clock,
  Send,
  UserCheck
} from 'lucide-react';
import { Contact, Relationship } from '../types/greeting';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ContactsManagerProps {
  contacts: Contact[];
  onSaveContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onCreateGreetingForContact: (contact: Contact) => void;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({
  contacts,
  onSaveContact,
  onDeleteContact,
  onCreateGreetingForContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRelationship, setFilterRelationship] = useState<string>('all');
  
  // Modal states for Add/Edit and Delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<Relationship>('best_friend');
  const [notes, setNotes] = useState('');

  const openAddModal = () => {
    setEditingContact(null);
    setName('');
    setPhone('');
    setRelationship('best_friend');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Contact) => {
    setEditingContact(c);
    setName(c.name);
    setPhone(c.phone);
    setRelationship(c.relationship);
    setNotes(c.notes || '');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const contact: Contact = {
      id: editingContact?.id || `contact-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      phone: phone.trim().replace(/[^0-9+]/g, ''),
      relationship,
      notes: notes.trim() || undefined,
      createdAt: editingContact?.createdAt || new Date().toISOString(),
      lastGreetingSentAt: editingContact?.lastGreetingSentAt
    };

    onSaveContact(contact);
    setIsModalOpen(false);
  };

  const filtered = contacts.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.notes && c.notes.toLowerCase().includes(q));

    const matchesRel = filterRelationship === 'all' || c.relationship === filterRelationship;
    return matchesSearch && matchesRel;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Action */}
      <div className="p-6 rounded-3xl bg-stone-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Friends & Contacts Directory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-festive text-amber-100">
            Saved Contacts for Greetings ({contacts.length})
          </h2>
          <p className="text-xs sm:text-sm text-stone-300">
            Keep your friends' names and WhatsApp phone numbers saved for instant personalized festive cards.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Contact
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-stone-900/70 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone number, or notes..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <select
          value={filterRelationship}
          onChange={e => setFilterRelationship(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-300 focus:outline-none focus:border-amber-400"
        >
          <option value="all">All Circles ({contacts.length})</option>
          <option value="best_friend">Best Friends</option>
          <option value="childhood_friend">Childhood Friends</option>
          <option value="family">Family</option>
          <option value="colleague">Colleagues</option>
          <option value="mentor">Mentors</option>
          <option value="festive_group">Festive Group</option>
        </select>
      </div>

      {/* Contacts List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center rounded-2xl bg-stone-900/40 border border-stone-800 space-y-3">
            <Users className="w-10 h-10 mx-auto text-amber-400/50" />
            <h3 className="text-base font-bold text-stone-200 font-festive">No contacts found</h3>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Add friends and their phone numbers to save them for quick personalized cards.
            </p>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Contact
            </button>
          </div>
        ) : (
          filtered.map(contact => (
            <div
              key={contact.id}
              className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold font-festive text-amber-100 flex items-center gap-2">
                      {contact.name}
                    </h3>
                    {/* Unboxed metadata per constitution */}
                    <span className="text-xs text-stone-400 capitalize">
                      {contact.relationship.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(contact)}
                      className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded-lg transition-colors"
                      title="Edit Contact"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setContactToDelete(contact)}
                      className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-lg transition-colors"
                      title="Delete Contact"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Phone number */}
                <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-300 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{contact.phone || 'No phone added'}</span>
                </div>

                {/* Notes */}
                {contact.notes && (
                  <p className="mt-2 text-xs text-stone-400 line-clamp-2 italic">
                    &ldquo;{contact.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Status and Action */}
              <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-500" />
                  {contact.lastGreetingSentAt ? (
                    <span className="text-amber-300/80 font-medium">
                      Sent {new Date(contact.lastGreetingSentAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span>Not sent yet</span>
                  )}
                </span>

                <button
                  onClick={() => onCreateGreetingForContact(contact)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Send Greeting
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-stone-900 border border-amber-500/30 text-stone-100 p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 space-y-1">
              <span className="text-amber-400 text-xs font-semibold tracking-wider uppercase">Contact Book</span>
              <h3 className="text-xl font-bold font-festive text-amber-100">
                {editingContact ? `Edit Contact: ${editingContact.name}` : 'Add Friend Contact'}
              </h3>
              <p className="text-xs text-stone-400">Save details for this and future festive greetings.</p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Friend's Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="e.g. 919876543210 (with country code)"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                  <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                </div>
                <p className="text-[10px] text-stone-400 mt-1">
                  Include country code (e.g. 91 for India, 1 for USA) without spaces.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Relationship Circle
                </label>
                <select
                  value={relationship}
                  onChange={e => setRelationship(e.target.value as Relationship)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="best_friend">Best Friend</option>
                  <option value="childhood_friend">Childhood Friend</option>
                  <option value="family">Family & Relatives</option>
                  <option value="colleague">Colleague / Workmate</option>
                  <option value="mentor">Mentor / Teacher</option>
                  <option value="festive_group">Festive Group / Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Notes / Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Loves jalebi, college roommate"
                  className="w-full px-3.5 py-2 text-sm rounded-xl bg-stone-950 border border-stone-700 text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-400 hover:text-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md"
                >
                  <Check className="w-4 h-4" />
                  {editingContact ? 'Save Changes' : 'Save Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(contactToDelete)}
        title="Delete Contact"
        itemName={contactToDelete?.name || ''}
        itemType="friends directory"
        onConfirm={() => {
          if (contactToDelete) {
            onDeleteContact(contactToDelete.id);
            setContactToDelete(null);
          }
        }}
        onCancel={() => setContactToDelete(null)}
      />
    </div>
  );
};

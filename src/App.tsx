/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GreetingCard, Contact } from './types/greeting';
import { 
  loadCards, 
  saveCard, 
  deleteCard, 
  loadContacts, 
  saveContact, 
  deleteContact 
} from './utils/storage';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { GreetingCardView } from './components/GreetingCardView';
import { CardStudioModal } from './components/CardStudioModal';

export default function App() {
  const [cards, setCards] = useState<GreetingCard[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeNavTab, setActiveNavTab] = useState<'dashboard' | 'greetings' | 'contacts' | 'themes'>('dashboard');
  
  // Full-screen recipient view state
  const [viewingCard, setViewingCard] = useState<GreetingCard | null>(null);

  // Card Studio Modal state
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<GreetingCard | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load cards and contacts on initial mount and check for ?card=<id> URL parameter
  useEffect(() => {
    const loadedCards = loadCards();
    const loadedContacts = loadContacts();
    setCards(loadedCards);
    setContacts(loadedContacts);

    const urlParams = new URLSearchParams(window.location.search);
    const cardParam = urlParams.get('card');
    if (cardParam) {
      const targetCard = loadedCards.find(c => c.id === cardParam);
      if (targetCard) {
        setViewingCard(targetCard);
      }
    }
  }, []);

  // Save Card handler
  const handleSaveCard = (card: GreetingCard) => {
    const updatedList = saveCard(card);
    setCards(updatedList);
    // Refresh contacts in case lastGreetingSentAt updated
    setContacts(loadContacts());
    setIsStudioOpen(false);
    setCardToEdit(null);
    showToast(`✨ Personalized greeting for ${card.friendName} saved!`);
  };

  // Delete Card handler
  const handleDeleteCard = (id: string) => {
    const updatedList = deleteCard(id);
    setCards(updatedList);
    if (viewingCard?.id === id) {
      setViewingCard(null);
    }
    showToast('Greeting deleted.');
  };

  // Save Contact handler
  const handleSaveContact = (contact: Contact) => {
    const updated = saveContact(contact);
    setContacts(updated);
    showToast(`👤 Contact for ${contact.name} saved.`);
  };

  // Delete Contact handler
  const handleDeleteContact = (id: string) => {
    const updated = deleteContact(id);
    setContacts(updated);
    showToast('Contact removed from directory.');
  };

  // Open Create Modal (optionally prefilled with a contact)
  const handleOpenCreateModal = (card?: GreetingCard, prefilledContact?: Contact) => {
    if (card) {
      setCardToEdit(card);
    } else if (prefilledContact) {
      setCardToEdit({
        id: '',
        friendName: prefilledContact.name,
        friendPhone: prefilledContact.phone,
        senderName: 'Kabir',
        senderWhatsApp: '919876543210',
        relationship: prefilledContact.relationship,
        themeId: 'royal_saffron',
        layoutId: 'interactive_diya',
        headline: 'Happy Vijayadashami & Dussehra!',
        shloka: 'यतो धर्मस्ततो जयः (Where there is Righteousness, there is Victory)',
        message: `May this auspicious day of Dussehra illuminate your path with courage, joy, and boundless prosperity. Wishing you and your loved ones triumphant moments and sweet celebrations!`,
        musicTrack: 'festive_shehnai',
        createdAt: new Date().toISOString(),
        viewCount: 0,
        firstViewedAt: null,
        lastViewedAt: null,
        hasInteracted: false,
        interactedAt: null,
        interactions: [],
        replies: []
      });
    } else {
      setCardToEdit(null);
    }
    setIsStudioOpen(true);
  };

  // If viewing a single card in full-screen recipient mode
  if (viewingCard) {
    return (
      <GreetingCardView
        card={viewingCard}
        onBackToStudio={() => {
          // Clear query param if present
          if (window.location.search.includes('card=')) {
            window.history.pushState({}, '', window.location.pathname);
          }
          // Reload cards to capture any views or replies
          setCards(loadCards());
          setViewingCard(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col antialiased selection:bg-amber-500 selection:text-stone-950">
      {/* 3-Zone Top Navigation Bar */}
      <TopNav
        activeView={activeNavTab}
        onNavigate={tab => setActiveNavTab(tab)}
        onOpenCreateModal={() => handleOpenCreateModal()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <Dashboard
          cards={cards}
          contacts={contacts}
          activeTab={activeNavTab}
          onNavigateTab={tab => setActiveNavTab(tab)}
          onOpenCreateModal={handleOpenCreateModal}
          onDeleteCard={handleDeleteCard}
          onSaveContact={handleSaveContact}
          onDeleteContact={handleDeleteContact}
          onSelectCardForPreview={card => setViewingCard(card)}
        />
      </main>

      {/* Card Studio Modal */}
      {isStudioOpen && (
        <CardStudioModal
          cardToEdit={cardToEdit}
          contacts={contacts}
          defaultSenderName="Kabir"
          defaultSenderWhatsApp="919876543210"
          onSave={handleSaveCard}
          onSaveContact={handleSaveContact}
          onClose={() => {
            setIsStudioOpen(false);
            setCardToEdit(null);
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pinned Quiet Footer */}
      <footer className="py-6 border-t border-stone-800/80 bg-stone-950/80 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Dussehra & Vijayadashami Digital Greetings · Made with devotion and festive cheer
          </p>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Triumph of Goodness</span>
            <span aria-hidden="true">·</span>
            <span>Happy Dussehra 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

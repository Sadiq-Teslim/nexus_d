// src/components/CaseReviewModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { MOCK_CCN_REPORT } from '../services/mockApiService';

const CaseReviewModal = ({ open, caseData, transaction: transactionProp, onClose, onAuthorize, onRelease, isProcessing, errorMessage }) => {
    const transaction = caseData || transactionProp;
    if (!open || !transaction) return null;
    const cdt = transaction.cdt || { regulatoryPenaltyValue: 0, reputationalDamageScore: 0 };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-5xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
                <header className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-white">Stage 4: Human Authorization</h2>
                        <p className="text-sm text-gray-400">Case ID: <span className="font-mono">{transaction.id}</span></p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X/></button>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-300 mb-2 text-sm uppercase tracking-wider">Stage 1: GNN Detection & Mapping</h3>
                                <div className="aspect-video bg-black rounded-lg border border-white/10 flex items-center justify-center">
                                    <p className="text-gray-500">Transaction network visualization</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-300 mb-2 text-sm uppercase tracking-wider">Stage 2: Consequence Modeling (CDT)</h3>
                                <div className="flex gap-4">
                                    <div className="flex-1 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <p className="text-xs text-yellow-400">Regulatory Penalty Value</p>
                                        <p className="text-2xl font-bold text-white">NGN {cdt.regulatoryPenaltyValue.toLocaleString()}</p>
                                    </div>
                                    <div className="flex-1 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-xs text-red-400">Reputational Damage Score</p>
                                        <p className="text-2xl font-bold text-white">{cdt.reputationalDamageScore}/10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-300 mb-2 text-sm uppercase tracking-wider">Stage 3: Compliance Narrative (CCN™)</h3>
                            <div className="h-[26.5rem] overflow-y-auto p-4 bg-black rounded-lg border border-white/10 text-sm text-gray-300 whitespace-pre-wrap font-mono">
                                {MOCK_CCN_REPORT}
                            </div>
                        </div>
                    </div>
                </main>
             <footer className="flex justify-end items-center gap-4 border-t border-white/10 p-6 shrink-0">
                 <p className="text-sm text-gray-500 mr-auto">Action is final and will be logged.</p>
                 <button onClick={() => onRelease(transaction.id)} disabled={isProcessing} className="px-6 py-2 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">Release Funds</button>
                 <button onClick={() => onAuthorize(transaction.id)} disabled={isProcessing} className="px-8 py-2 rounded-lg bg-zenithRed text-white font-semibold hover:brightness-110 transition-all shadow-lg shadow-zenithRed/30">{isProcessing ? 'Processing…' : 'Authorize Formal Hold'}</button>
             </footer>
            </div>
        </div>
    );
};

export default CaseReviewModal;
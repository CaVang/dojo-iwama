"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Calendar, MapPin, Tag } from "lucide-react";
import EventFormModal from "./EventFormModal";

interface DojoEvent {
  id: string;
  dojo_id: string;
  title: string;
  description: string;
  date: string;
  end_date: string | null;
  location: string;
  image_url: string;
  event_type: string;
  instructor: string;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DojoEvent | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/dashboard/dojo/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sự kiện này? Hành động này không thể hoàn tác.")) return;

    try {
      const res = await fetch(`/api/dashboard/dojo/events?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents(events.filter((e) => e.id !== id));
      } else {
        alert("Lỗi khi xóa sự kiện");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi");
    }
  };

  const handleEdit = (event: DojoEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleSave = (savedEvent: DojoEvent) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === savedEvent.id ? savedEvent : e));
    } else {
      setEvents([...events, savedEvent]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-japan-blue/10 pb-4">
        <div>
          <h1 className="font-serif text-2xl text-sumi">Quản lý Sự kiện</h1>
          <p className="text-sumi-muted text-sm mt-1">Sự kiện, kỳ thi, tập huấn của Võ đường</p>
        </div>
        <button 
          onClick={handleAdd}
          className="btn-primary py-2 px-4 shadow-sm flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Thêm Sự kiện</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-4 border-japan-blue border-t-transparent animate-spin"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-japan-blue/10 border-dashed">
          <Calendar className="w-12 h-12 text-japan-blue/30 mx-auto mb-4" />
          <h3 className="text-lg font-serif text-sumi mb-2">Chưa có sự kiện nào</h3>
          <p className="text-sumi-muted max-w-sm mx-auto">Võ đường bạn chưa tạo sự kiện nào. Hãy thêm một sự kiện mới để hiển thị lên trang chủ để mọi người tham gia nhé.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border border-japan-blue/10 overflow-hidden flex flex-col group">
              {/* Event Image Banner (Optional Preview) */}
              {event.image_url ? (
                <div 
                  className="h-32 w-full bg-cover bg-center border-b border-japan-blue/10"
                  style={{ backgroundImage: `url(${event.image_url})` }}
                  title={event.title}
                />
              ) : (
                <div className="h-4 w-full bg-gradient-to-r from-japan-blue/20 to-washi-cream" />
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl text-sumi font-bold pr-4 leading-tight">{event.title}</h3>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(event)} className="p-1.5 text-sumi-muted hover:text-japan-blue hover:bg-japan-blue/10 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-1.5 text-sumi-muted hover:text-red-500 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mt-2 flex-1">
                  <div className="flex items-center gap-2 text-sm text-sumi-muted">
                    <Calendar size={14} className="text-japan-blue/70" />
                    <span>
                      {new Date(event.date).toLocaleDateString("vi-VN")} 
                      {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString("vi-VN")}`}
                    </span>
                  </div>
                  {event.location && (
                     <div className="flex items-center gap-2 text-sm text-sumi-muted">
                       <MapPin size={14} className="text-japan-blue/70" />
                       <span className="line-clamp-1">{event.location}</span>
                     </div>
                  )}
                  {event.event_type && (
                     <div className="flex items-center gap-2 text-sm text-sumi-muted">
                        <Tag size={14} className="text-japan-blue/70" />
                        <span className="capitalize">{event.event_type}</span>
                     </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' : 
                    event.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {event.status === 'published' ? 'Đã Xuất bản' : event.status === 'cancelled' ? 'Hủy' : 'Bản nháp'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <EventFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={editingEvent}
        />
      )}
    </div>
  );
}

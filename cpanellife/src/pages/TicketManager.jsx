import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTickets,
  deleteTicket,
  setFilters,
  fetchTicketStatuses,
  fetchTicketTypes,
} from "../store/ticketManagerSlice";
import TicketTable from "../components/TicketManager/TicketTable";
import TicketEditModal from "../components/TicketManager/TicketEditModal";
import TicketFormViewModal from "../components/TicketManager/TicketFormViewModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { message } from "antd";

const TicketManager = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.ticketManager.tickets || []);
  const isLoading = useSelector((state) => state.ticketManager.loading);
  const filters = useSelector((state) => state.ticketManager.filters);
  const ticketTypes = useSelector((state) => state.ticketManager.catalog.ticketTypes || []);
  const ticketStatuses = useSelector((state) => state.ticketManager.catalog.ticketStatuses || []);
  const catalogLastFetchTime = useSelector((state) => state.ticketManager.catalog.lastFetchTime);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Helper function to build active filters (only non-null values)
  const buildActiveFilters = useCallback(
    (filterObj = filters) => {
      const activeFilters = {};
      if (filterObj.TicketType !== null && filterObj.TicketType !== undefined) {
        activeFilters.TicketType = filterObj.TicketType;
      }
      if (filterObj.TicketStatus !== null && filterObj.TicketStatus !== undefined) {
        activeFilters.TicketStatus = filterObj.TicketStatus;
      }
      if (filterObj.Email !== null && filterObj.Email !== undefined) {
        activeFilters.Email = filterObj.Email;
      }
      return activeFilters;
    },
    [filters]
  );

  useEffect(() => {
    // Only fetch catalog data if not already loaded or if it's been more than 5 minutes
    const CATALOG_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    const shouldFetchCatalog =
      ticketTypes.length === 0 ||
      ticketStatuses.length === 0 ||
      !catalogLastFetchTime ||
      Date.now() - catalogLastFetchTime > CATALOG_CACHE_DURATION;

    if (shouldFetchCatalog) {
      dispatch(fetchTicketStatuses()).catch((error) => {
        console.error("Failed to fetch ticket statuses:", error);
        message.error("Failed to load ticket statuses");
      });
      dispatch(fetchTicketTypes()).catch((error) => {
        console.error("Failed to fetch ticket types:", error);
        message.error("Failed to load ticket types");
      });
    }

    // Only fetch tickets if not already loaded
    if (tickets.length === 0) {
      dispatch(fetchTickets({ filters: buildActiveFilters() }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
      dispatch(fetchTickets({ filters: buildActiveFilters(newFilters) }));
    },
    [dispatch, buildActiveFilters]
  );

  const handleEdit = useCallback((ticket) => {
    setSelectedTicket(ticket);
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (ticketId) => {
      try {
        await dispatch(deleteTicket(ticketId)).unwrap();
        message.success("Ticket deleted successfully");
        // Refresh tickets after deletion with current filters
        dispatch(fetchTickets({ filters: buildActiveFilters() }));
      } catch (error) {
        message.error(error || "Failed to delete ticket");
      }
    },
    [dispatch, buildActiveFilters]
  );

  const handleView = useCallback((ticket) => {
    setSelectedTicket(ticket);
    setViewModalOpen(true);
  }, []);

  const handleEditSuccess = useCallback(() => {
    // Refresh tickets after successful edit with current filters
    dispatch(fetchTickets({ filters: buildActiveFilters() }));
  }, [dispatch, buildActiveFilters]);

  const handleEditModalClose = () => {
    setEditModalOpen(false);
    setSelectedTicket(null);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
    setSelectedTicket(null);
  };

  if (isLoading && tickets.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{ padding: 16 }}>
      <TicketTable
        tickets={tickets}
        loading={isLoading}
        ticketTypes={ticketTypes}
        ticketStatuses={ticketStatuses}
        onFilterChange={handleFilterChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <TicketEditModal
        open={editModalOpen}
        onCancel={handleEditModalClose}
        ticket={selectedTicket}
        ticketTypes={ticketTypes}
        ticketStatuses={ticketStatuses}
        onSuccess={handleEditSuccess}
      />

      <TicketFormViewModal open={viewModalOpen} onCancel={handleViewModalClose} ticket={selectedTicket} />
    </div>
  );
};

export default TicketManager;

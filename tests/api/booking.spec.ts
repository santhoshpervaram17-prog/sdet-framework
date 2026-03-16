import { test, expect } from '@playwright/test';
import { BookingApi, Booking } from './BookingApi';

const newBooking: Booking = {
  firstname: 'Santhosh',
  lastname: 'Kumar',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2025-06-01',
    checkout: '2025-06-05',
  },
  additionalneeds: 'Breakfast',
};

// Shared state — lives at module level, persists across all tests
const state = { bookingId: 0 };

test.describe.serial('Restful Booker API Tests', () => {

  test('GET all bookings returns 200 and array', async ({ request }) => {
    const api = new BookingApi(request);
    const result = await api.getAllBookings();

    expect(result.status).toBe(200);
    expect(Array.isArray(result.body)).toBeTruthy();
    expect(result.body.length).toBeGreaterThan(0);
    console.log(`Total bookings: ${result.body.length}`);
  });

  test('GET single booking returns correct structure', async ({ request }) => {
    const api = new BookingApi(request);
    
    // Get real ID from the list first
    const allResult = await api.getAllBookings();
    const firstId = allResult.body[0].bookingid;
    
    const result = await api.getBookingById(firstId);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('firstname');
    expect(result.body).toHaveProperty('lastname');
    expect(result.body).toHaveProperty('totalprice');
    expect(result.body).toHaveProperty('bookingdates');
    console.log(`Fetched booking ID: ${firstId}`, result.body);
  })

  test('POST create booking returns 200 with booking id', async ({ request }) => {
    const api = new BookingApi(request);
    const result = await api.createBooking(newBooking);

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('bookingid');
    expect(result.body.booking.firstname).toBe('Santhosh');
    expect(result.body.booking.totalprice).toBe(150);

    state.bookingId = result.body.bookingid;
    console.log(`Created booking ID: ${state.bookingId}`);
  });

  test('PUT update booking returns updated data', async ({ request }) => {
    const api = new BookingApi(request);
    await api.getToken();

    console.log(`Updating booking ID: ${state.bookingId}`);
    const result = await api.updateBooking(state.bookingId, {
      ...newBooking,
      firstname: 'Updated',
      totalprice: 200,
    });

    expect(result.status).toBe(200);
    expect(result.body.firstname).toBe('Updated');
    expect(result.body.totalprice).toBe(200);
  });

  test('PATCH partial update changes only given fields', async ({ request }) => {
    const api = new BookingApi(request);
    await api.getToken();

    const result = await api.partialUpdateBooking(state.bookingId, {
      firstname: 'Patched',
    });

    expect(result.status).toBe(200);
    expect(result.body.firstname).toBe('Patched');
    expect(result.body.lastname).toBe('Kumar');
  });

  test('DELETE booking returns 201', async ({ request }) => {
    const api = new BookingApi(request);
    await api.getToken();

    console.log(`Deleting booking ID: ${state.bookingId}`);
    const result = await api.deleteBooking(state.bookingId);
    expect(result.status).toBe(201);
  });

  test('GET deleted booking returns 404', async ({ request }) => {
    const api = new BookingApi(request);

    console.log(`Verifying deleted booking ID: ${state.bookingId}`);
    const result = await api.getBookingById(state.bookingId);
    expect(result.status).toBe(404);
  });

});

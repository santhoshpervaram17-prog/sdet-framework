import { APIRequestContext } from '@playwright/test';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export class BookingApi {
  private request: APIRequestContext;
  private baseURL = 'https://restful-booker.herokuapp.com';
  private token: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  // AUTH
  async getToken(): Promise<string> {
    const response = await this.request.post(`${this.baseURL}/auth`, {
      data: {
        username: 'admin',
        password: 'password123',
      },
    });
    const body = await response.json();
    this.token = body.token;
    return this.token;
  }

  // GET all booking IDs
  async getAllBookings() {
    const response = await this.request.get(`${this.baseURL}/booking`);
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  // GET single booking
  async getBookingById(id: number) {
    const response = await this.request.get(`${this.baseURL}/booking/${id}`);
    const status = response.status();
    
    // 404 returns plain text "Not Found", not JSON
    if (status === 404) {
      return { status, body: null };
    }
    
    return {
      status,
      body: await response.json(),
    };
  }

  // CREATE booking
  async createBooking(booking: Booking) {
    const response = await this.request.post(`${this.baseURL}/booking`, {
      data: booking,
      headers: { 'Content-Type': 'application/json' },
    });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  // UPDATE booking
  async updateBooking(id: number, booking: Booking) {
    const response = await this.request.put(`${this.baseURL}/booking/${id}`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${this.token}`,
      },
    });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  // PARTIAL UPDATE
  async partialUpdateBooking(id: number, data: Partial<Booking>) {
    const response = await this.request.patch(`${this.baseURL}/booking/${id}`, {
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${this.token}`,
      },
    });
    return {
      status: response.status(),
      body: await response.json(),
    };
  }

  // DELETE booking
  async deleteBooking(id: number) {
    const response = await this.request.delete(`${this.baseURL}/booking/${id}`, {
      headers: {
        Cookie: `token=${this.token}`,
      },
    });
    return {
      status: response.status(),
    };
  }
}
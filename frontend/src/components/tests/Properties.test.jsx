import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Properties from '../Properties';
import { PropertiesProvider } from '../PropertiesContext';
import * as api from '../../api';

// Mock the API module
vi.mock('../../api', () => ({
  getProperties: vi.fn()
}));

const mockProperties = [
  {
    id: 1,
    title: 'Test Property 1',
    location: 'Nairobi',
    type: 'Residential',
    price: 1000000,
    status: 'Active',
    image: 'test-image-1.jpg'
  },
  {
    id: 2,
    title: 'Test Property 2',
    location: 'Mombasa',
    type: 'Commercial',
    price: 2000000,
    status: 'Active',
    image: 'test-image-2.jpg'
  }
];

describe('Properties Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getProperties.mockResolvedValue(mockProperties);
  });

  const renderComponent = async () => {
    await act(async () => {
      render(
        <PropertiesProvider>
          <Properties />
        </PropertiesProvider>
      );
    });
  };

  it('renders without crashing', async () => {
    await renderComponent();
    expect(screen.getByText('Properties')).toBeInTheDocument();
  });

  it('displays property cards when data is loaded', async () => {
    await renderComponent();
    expect(await screen.findByText('Test Property 1')).toBeInTheDocument();
    expect(await screen.findByText('Test Property 2')).toBeInTheDocument();
  });

  it('filters properties by location', async () => {
    await renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Location'), {
      target: { value: 'Nairobi' }
    });
    expect(screen.getByText('Test Property 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Property 2')).not.toBeInTheDocument();
  });

  it('filters properties by price', async () => {
    await renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Max Price (KES)'), {
      target: { value: '1500000' }
    });
    expect(screen.getByText('Test Property 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Property 2')).not.toBeInTheDocument();
  });

  it('filters properties by type', async () => {
    await renderComponent();
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Commercial' }
    });
    expect(screen.queryByText('Test Property 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Property 2')).toBeInTheDocument();
  });

  it('handles empty property list', async () => {
    api.getProperties.mockResolvedValueOnce([]);
    await renderComponent();
    expect(await screen.findByText('No properties found.')).toBeInTheDocument();
  });

  it('handles API error gracefully', async () => {
    api.getProperties.mockRejectedValueOnce(new Error('Failed to fetch'));

    await act(async () => {
      render(
        <PropertiesProvider>
          <Properties />
        </PropertiesProvider>
      );
    });

    // Match based on your actual fallback error text from Properties.jsx
    expect(
      await screen.findByText((content) => content.includes('Failed to fetch') || content.includes('Unable to load'))
    ).toBeInTheDocument();
  });

  it('filters properties with multiple criteria', async () => {
    await renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Location'), {
      target: { value: 'Nairobi' }
    });
    fireEvent.change(screen.getByPlaceholderText('Max Price (KES)'), {
      target: { value: '1500000' }
    });
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Residential' }
    });
    expect(screen.getByText('Test Property 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Property 2')).not.toBeInTheDocument();
  });

  it('handles case-insensitive location search', async () => {
    await renderComponent();
    fireEvent.change(screen.getByPlaceholderText('Location'), {
      target: { value: 'nairobi' }
    });
    expect(screen.getByText('Test Property 1')).toBeInTheDocument();
  });

  it('clears filters when input is empty', async () => {
    await renderComponent();
    const locationInput = screen.getByPlaceholderText('Location');
    fireEvent.change(locationInput, { target: { value: 'Nairobi' } });
    fireEvent.change(locationInput, { target: { value: '' } });
    expect(screen.getByText('Test Property 1')).toBeInTheDocument();
    expect(screen.getByText('Test Property 2')).toBeInTheDocument();
  });
});

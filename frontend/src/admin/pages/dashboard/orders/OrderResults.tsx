import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CodeSnippet from '../../../utils/CodeSnippet';

interface ServiceOrderItem {
  sku_number: string;
  serial_number: string;
  description: string;
  quantity: number;
  delivered: boolean;
  manager_notes: string;
  customer_notes: string;
  driver_notes: string;
}

interface Survey {
  questions: { number: number; comment: string }[];
  comments: { comment: string }[];
}

interface AdditionalFields {
  additional_field_one?: string;
  additional_field_two?: string;
}

interface CustomFields {
  custom_field_one?: string;
  custom_field_two?: string;
}

interface Signature {
  created_at: string;
  callback_code: string;
}

interface ServiceOrder {
  order_number: string;
  status: string;
  service_type: string;
  description: string;
  account_name: string;
  confirmation_status: string;
  text_confirmation_status: string;
  stop_number: number;
  route_locked: boolean;
  delivery_date: string;
  delivery_time_window_start: string;
  delivery_time_window_end: string;
  scheduled_at: string;
  time_window_start: string;
  time_window_end: string;
  route_tag: string;
  service_duration: number;
  service_unit: string;
  survey_status: string;
  survey_received_date: string;
  started_at: string;
  finished_at: string;
  amount: number;
  pieces: number;
  volume: number;
  delivery_charges: number;
  sales_tax: number;
  truck: { id: string; name: string };
  drivers: { id: string; name: string }[];
  pod: { url: string };
  customer: {
    customer_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone1: string;
    phone2: string;
    phone3: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    latitude: string;
    longitude: string;
  };
  images: { id: number; name: string; src: string; thumbnail: string; created_at: string }[];
  scanned_documents: { src: string; thumbnail: string; created_at: string }[];
  notes: { content: string; author: string; created_at: string }[];
  service_order_items: ServiceOrderItem[];
  surveys?: Survey;
  additional_fields: AdditionalFields;
  custom_fields: CustomFields;
  signature: Signature;
}

interface ResponseData {
  success: boolean;
  status: number;
  message: string;
  data: {
    success: boolean;
    status: number;
    note: string;
    service_orders: ServiceOrder[];
  };
}

// Placeholder SVG component
const PlaceholderImage: React.FC = () => (
  <svg className="w-full h-32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" fill="#f3f4f6" />
    <text x="50%" y="50%" textAnchor="middle" fill="#9ca3af" dy=".3em">
      No Image
    </text>
  </svg>
);

// Section component for consistent styling
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="bg-white p-4 rounded-sm shadow-sm">
    <h3 className="text-xl font-medium text-gray-900 mb-4 border-b pb-2">{title}</h3>
    {children}
  </div>
);

// Field component for displaying labeled data
interface FieldProps {
  label: string;
  value: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, value }) => (
  <div className="border-b border-gray-100 p-2 mb-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 text-sm text-gray-900 break-all">{value || 'N/A'}</div>
  </div>
);


const OrderResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as { responseData: ResponseData } | null;
  const responseData = locationState?.responseData;

  if (!responseData) {
    return (
      <div className="space-y-6">
        <div className="text-center py-10 px-6 bg-white rounded-sm shadow-sm text-red-500">
          <svg className="w-12 h-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No Data Available</h3>
          <p className="mb-4">No export data available. Please try exporting orders again.</p>
          <button
            onClick={() => navigate('/dashboard/exportorders')}
            className="px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Back to Export
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Export Results</h1>
        <button
          onClick={() => navigate('/dashboard/exportorders')}
          className="px-4 py-2 border border-transparent rounded-sm shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Back to Export
        </button>
      </div>

      {/* New JSON Data Section */}
      <CodeSnippet data={responseData} title="Response Data (JSON)" />

      {responseData.data.service_orders.map((order, index) => (
        <div key={index} className="mb-8 bg-gray-50 p-4 rounded-sm shadow">
          {/* Individual Order JSON Data */}
          
          <div className="bg-white rounded-sm shadow-sm p-4 mb-4">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-sm mr-2">#{order.order_number}</span>
              <span>{order.service_type}</span>
              <span className="ml-auto text-sm px-2 py-1 rounded-sm bg-blue-100 text-blue-800">{order.status}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Notes Section */}
            {order.notes.length > 0 && (
              <div className="lg:col-span-2">
                <Section title="Order Notes">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.notes.map((note, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-sm">
                        <p className="text-sm">{note.content}</p>
                        <p className="mt-2 text-xs text-gray-500">By {note.author} at {note.created_at}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Order Information */}
            <Section title="Order Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Status" value={order.status} />
                <Field label="Service Type" value={order.service_type} />
                <Field label="Description" value={order.description} />
                <Field label="Account Name" value={order.account_name} />
                <Field label="Confirmation Status" value={order.confirmation_status} />
                <Field label="Text Confirmation" value={order.text_confirmation_status} />
                <Field label="Stop Number" value={order.stop_number} />
                <Field label="Route Locked" value={order.route_locked ? 'Yes' : 'No'} />
              </div>
            </Section>

            {/* Delivery Details */}
            <Section title="Delivery Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Delivery Date" value={order.delivery_date} />
                <Field label="Delivery Window" value={`${order.delivery_time_window_start} - ${order.delivery_time_window_end}`} />
                <Field label="Scheduled At" value={order.scheduled_at} />
                <Field label="Time Window" value={`${order.time_window_start} - ${order.time_window_end}`} />
                <Field label="Started At" value={order.started_at} />
                <Field label="Finished At" value={order.finished_at} />
                <Field label="Truck" value={`${order.truck.name} (${order.truck.id})`} />
                <Field label="Drivers" value={order.drivers.map(d => d.name).join(', ')} />
              </div>
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Financial Details */}
            <Section title="Financial Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Amount" value={`$${order.amount.toFixed(2)}`} />
                <Field label="Pieces" value={order.pieces} />
                <Field label="Volume" value={order.volume} />
                <Field label="Delivery Charges" value={`$${order.delivery_charges.toFixed(2)}`} />
                <Field label="Sales Tax" value={`$${order.sales_tax.toFixed(2)}`} />
                <Field label="Service Duration" value={`${order.service_duration} min`} />
                <Field label="Service Unit" value={order.service_unit} />
                <Field
                  label="POD"
                  value={
                    <a href={order.pod.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  }
                />
              </div>
            </Section>

            {/* Customer Information */}
            <Section title="Customer Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Name" value={`${order.customer.first_name} ${order.customer.last_name}`} />
                <Field label="Email" value={order.customer.email} />
                <Field label="Phone 1" value={order.customer.phone1} />
                <Field label="Phone 2" value={order.customer.phone2} />
                <Field label="Phone 3" value={order.customer.phone3} />
                <Field label="Address" value={`${order.customer.address1} ${order.customer.address2}`} />
                <Field label="Location" value={`${order.customer.city}, ${order.customer.state} ${order.customer.zip}`} />
                <Field label="Coordinates" value={`${order.customer.latitude}, ${order.customer.longitude}`} />
              </div>
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Survey Details */}
            <Section title="Survey Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Survey Status" value={order.survey_status} />
                <Field label="Survey Received Date" value={order.survey_received_date || 'N/A'} />

                {order.surveys && (
                  <>
                    <div className="col-span-2">
                      <Field
                        label="Survey Questions"
                        value={
                          <div className="space-y-1">
                            {order.surveys.questions.map((question, idx) => (
                              <p key={idx}>Q{question.number}: {question.comment}</p>
                            ))}
                          </div>
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Field
                        label="Survey Comments"
                        value={
                          <div className="space-y-1">
                            {order.surveys.comments.map((comment, idx) => (
                              <p key={idx}>{comment.comment}</p>
                            ))}
                          </div>
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </Section>

            {/* Additional and Custom Fields */}
            <Section title="Additional & Custom Fields">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Additional Field One" value={order.additional_fields.additional_field_one} />
                <Field label="Additional Field Two" value={order.additional_fields.additional_field_two} />
                <Field label="Custom Field One" value={order.custom_fields.custom_field_one} />
                <Field label="Custom Field Two" value={order.custom_fields.custom_field_two} />
                <div className="col-span-2">
                  <Field
                    label="Signature"
                    value={
                      <div>
                        <p>Created At: {order.signature.created_at}</p>
                        <p>Callback Code: {order.signature.callback_code}</p>
                      </div>
                    }
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* Service Order Items */}
          <Section title="Service Order Items">
            {order.service_order_items && order.service_order_items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {order.service_order_items.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-sm">
                    <div className="border-b border-gray-200 pb-2 mb-2">
                      <h4 className="font-medium">Item {idx + 1}</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Field label="SKU" value={item.sku_number} />
                      <Field label="Serial" value={item.serial_number} />
                      <Field label="Description" value={item.description} />
                      <Field label="Quantity" value={item.quantity} />
                      <Field label="Delivered" value={item.delivered ? 'Yes' : 'No'} />
                      <Field label="Manager Notes" value={item.manager_notes} />
                      <Field label="Customer Notes" value={item.customer_notes} />
                      <Field label="Driver Notes" value={item.driver_notes} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No service order items available
              </div>
            )}
          </Section>

          {/* Images */}
          <Section title="Images">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {order.images.length > 0 ? (
                order.images.map(img => (
                  <div key={img.id} className="bg-gray-50 p-2 rounded-sm">
                    <img
                      src={img.thumbnail}
                      alt={img.name}
                      className="w-full h-32 object-cover rounded-sm"
                    />
                    <p className="text-sm text-gray-700 mt-2 truncate">{img.name}</p>
                    <p className="text-xs text-gray-500">{img.created_at}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-4">
                  <PlaceholderImage />
                  <p className="mt-2 text-sm text-gray-500">No images available</p>
                </div>
              )}
            </div>
          </Section>

          {/* Scanned Documents */}
          <Section title="Scanned Documents">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {order.scanned_documents.length > 0 ? (
                order.scanned_documents.map((doc, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-sm">
                    <p className="text-sm font-medium">Document {idx + 1}</p>
                    <p className="mt-1 text-sm">
                      <a
                        href={doc.src}
                        className="text-blue-600 hover:underline flex items-center"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        View Document
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Created: {doc.created_at}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-gray-500">
                  No scanned documents available
                </div>
              )}
            </div>
          </Section>
        </div>
      ))}
    </div>
  );
};

export default OrderResults;
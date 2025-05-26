import { MapPin, User } from "lucide-react";
import { useState } from "react";
import TextInput from "../Inputs/TextInput";
import TextAreaInput from "../Inputs/TextAreaInput";

interface InformationProps {
  information: {
    name: { value: string; err: string };
    location: { value: string; err: string };
    organizedBy: { value: string; err: string };
    description: { value: string; err: string };
  };
  setInformation: (information: any) => void;
}

export default function Information({
  information,
  setInformation,
}: InformationProps) {
  const validateName = (name: string): boolean => {
    return name.length >= 3 && name.length <= 100;
  };

  const validateLocation = (location: string): boolean => {
    return location.length >= 3 && location.length <= 200;
  };

  const validateOrganizer = (organizer: string): boolean => {
    return organizer.length >= 3 && organizer.length <= 100;
  };

  const handleNameChange = (value: string) => {
    setInformation({
      ...information,
      name: {
        value,
        err: validateName(value)
          ? ""
          : "Name must be between 3 and 100 characters",
      },
    });
  };

  const handleLocationChange = (value: string) => {
    setInformation({
      ...information,
      location: {
        value,
        err: validateLocation(value)
          ? ""
          : "Location must be between 3 and 200 characters",
      },
    });
  };

  const handleOrganizerChange = (value: string) => {
    setInformation({
      ...information,
      organizedBy: {
        value,
        err: validateOrganizer(value)
          ? ""
          : "Organizer must be between 3 and 100 characters",
      },
    });
  };

  const handleDescriptionChange = (value: string) => {
    setInformation({
      ...information,
      description: {
        value,
        err: "",
      },
    });
  };

  return (
    <>
      <section className="eventra-container-narrow pt-5">
        <div className="px-7 py-5 bg-white rounded-xl mt-5 flex gap-2 flex-col">
          <h1 className="font-[500] text-lg">Event Information</h1>
          <div className="flex gap-5">
            <div className="flex-col flex gap-5 w-1/2">
              <div className="property">
                <TextInput
                  identifier="event-name"
                  title="Event Name"
                  value={information.name.value}
                  onInput={handleNameChange}
                  error={information.name.err}
                  placeholder="Enter event name"
                  req
                />
              </div>
              <div className="property">
                <TextInput
                  identifier="event-location"
                  title="Event Location"
                  value={information.location.value}
                  onInput={handleLocationChange}
                  error={information.location.err}
                  placeholder="Enter event location"
                  req
                />
              </div>
              <div className="property">
                <TextInput
                  identifier="event-organizer"
                  title="Event Organized By"
                  value={information.organizedBy.value}
                  onInput={handleOrganizerChange}
                  error={information.organizedBy.err}
                  placeholder="Enter organizer name"
                  req
                />
              </div>
            </div>
            <div className="flex-col flex gap-5 w-1/2">
              <div className="property">
                <TextAreaInput
                  identifier="event-description"
                  title="Event Description"
                  value={information.description.value}
                  onInput={handleDescriptionChange}
                  error={information.description.err}
                  placeholder="Enter event description"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

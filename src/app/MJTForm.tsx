"use client";

import type { Key } from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { FormEvent, useState } from "react";
import { IoPaperPlane, IoBus } from "react-icons/io5";
import {
  ComboBox,
  Input,
  ListBox,
  Label,
  Calendar,
  DateField,
  DatePicker,
  TimeField,
} from "@heroui/react";
import {
  getLocalTimeZone,
  now,
  CalendarDateTime,
} from "@internationalized/date";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRouteAndShelter, getSchedule } from "@/http/api";
import { useSchedule } from "@/utils/store";
import responseExtractor from "@/utils/responseExtractor";
import Loader from "./Loader";

export default function MJTForm() {
  const { data, isFetching } = useQuery({
    queryKey: ["shelters"],
    queryFn: async () => {
      const responseData = await getRouteAndShelter();
      const cleanData = Array.isArray(responseData)
        ? responseData
        : responseData?.data || [];

      if (cleanData.length === 0) {
        throw new Error("Failed to fetch shelters");
      }

      const routes = cleanData.map((res: any) => ({
        id: res.id_rute,
        name: res.arah_tujuan,
      }));

      const shelters: any = {};

      cleanData.forEach((res: any) => {
        shelters[res.id_rute] = res.halte.map((h: any) => {
          return {
            shelter: h.nama_shelter,
            lat: h.latitude,
            long: h.longitude,
          };
        });
      });

      return { routes, shelters };
    },
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["schedule"],
    mutationFn: getSchedule,
  });

  const storeSchedules = useSchedule((state) => state.storeSchedules);

  const [routeId, setRouteId] = useState<Key | null>(null);
  const [routeShelters, setRouteShelters] = useState<{
    origin: Key | null;
    toward: Key | null;
  }>({
    origin: null,
    toward: null,
  });
  const [dt, setDt] = useState<DateValue | null>(now(getLocalTimeZone()));

  const [routeInput, setRouteInput] = useState("");
  const [originInput, setOriginInput] = useState("");
  const [towardInput, setTowardInput] = useState("");

  const allRoutes = data?.routes || [];
  const shelterList = data?.shelters?.[routeId as string] || [];
  const filteredRoutes = allRoutes.filter((r: any) =>
    r.name.toLowerCase().includes(routeInput.toLowerCase()),
  );
  const filteredOrigin = shelterList.filter((s: any) =>
    s.shelter.toLowerCase().includes(originInput.toLowerCase()),
  );
  const filteredToward = shelterList.filter((s: any) =>
    s.shelter.toLowerCase().includes(towardInput.toLowerCase()),
  );

  const getPayloadString = (dateObj: DateValue | null) => {
    if (!dateObj) return "";
    const obj = dateObj as CalendarDateTime;

    const year = obj.year;
    const month = String(obj.month).padStart(2, "0");
    const day = String(obj.day).padStart(2, "0");
    const hour = String(obj.hour || 0).padStart(2, "0");
    const minute = String(obj.minute || 0).padStart(2, "0");
    const second = String(obj.second || 0).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  const resetForm = () => {
    setRouteId(null);
    setRouteShelters({ origin: null, toward: null });
    setDt(now(getLocalTimeZone()));
    setRouteInput("");
    setOriginInput("");
    setTowardInput("");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const targetDatetime = getPayloadString(dt);
    const payload = {
      prediksi: "sampai",
      nama_shelter: routeShelters.origin,
      halte_tujuan: routeShelters.toward,
      target_datetime: targetDatetime,
    };
    mutate(payload, {
      onSuccess: (data) => {
        const responseData = data.data[0].jadwal_kedatangan;
        const cleanData = responseExtractor(responseData);
        storeSchedules(cleanData);
        resetForm();
      },
    });
  };

  return (
    <section className="p-6 rounded-lg border border-blue-400">
      {(isFetching || isPending) && <Loader />}
      <form onSubmit={onSubmit} className="space-y-4">
        <div id="route-section" className="space-y-1.5">
          <Label htmlFor="routes">Pilih Rute MJT</Label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 shrink-0 rounded-md bg-blue-600 flex items-center justify-center">
              <IoPaperPlane className="text-white" size={24} />
            </div>
            <ComboBox
              id="routes"
              className="flex-1 min-w-0"
              aria-labelledby="routes-label"
              selectedKey={routeId}
              inputValue={routeInput}
              onInputChange={setRouteInput}
              onSelectionChange={(key) => {
                setRouteId(key);
                setRouteShelters({ origin: null, toward: null });
                setOriginInput("");
                setTowardInput("");
                const selected = allRoutes.find((r: any) => r.id === key);
                setRouteInput(selected?.name ?? "");
              }}
              items={filteredRoutes}
            >
              <ComboBox.InputGroup>
                <Input placeholder="Pilih Rute" />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  {(r: any) => (
                    <ListBox.Item id={r.id} textValue={r.name}>
                      {r.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>
          </div>
        </div>
        <div id="origin-shelter-section" className="space-y-1.5">
          <Label htmlFor="origin">Halte Awal</Label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 shrink-0 rounded-md bg-white flex items-center justify-center">
              <IoBus className="text-blue-600" size={32} />
            </div>
            <ComboBox
              id="origin"
              className="flex-1 min-w-0"
              aria-labelledby="origin-label"
              selectedKey={routeShelters.origin}
              inputValue={originInput}
              onInputChange={setOriginInput}
              onSelectionChange={(key) => {
                setRouteShelters((prev) => ({ ...prev, origin: key }));
                const selected = shelterList.find(
                  (s: any) => s.shelter.toLowerCase() === key,
                );
                setOriginInput(selected?.shelter ?? "");
              }}
              items={filteredOrigin}
            >
              <ComboBox.InputGroup>
                <Input placeholder="Pilih Halte Awal" />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  {(s: any) => (
                    <ListBox.Item
                      id={s.shelter.toLowerCase()}
                      textValue={s.shelter}
                    >
                      {s.shelter}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>
          </div>
        </div>
        <div id="toward-shelter-section" className="space-y-1.5">
          <Label htmlFor="toward">Halte Tujuan</Label>
          <div className="flex gap-2 items-center">
            <div className="w-9 h-9 shrink-0 rounded-md bg-white flex items-center justify-center">
              <IoBus className="text-blue-600" size={32} />
            </div>
            <ComboBox
              id="toward"
              className="flex-1 min-w-0"
              aria-labelledby="toward-label"
              selectedKey={routeShelters.toward}
              inputValue={towardInput}
              onInputChange={setTowardInput}
              onSelectionChange={(key) => {
                setRouteShelters((prev) => ({ ...prev, toward: key }));
                const selected = shelterList.find(
                  (s: any) => s.shelter.toLowerCase() === key,
                );
                setTowardInput(selected?.shelter ?? "");
              }}
              items={filteredToward}
            >
              <ComboBox.InputGroup>
                <Input placeholder="Pilih Halte Tujuan" />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  {(s: any) => (
                    <ListBox.Item
                      id={s.shelter.toLowerCase()}
                      textValue={s.shelter}
                    >
                      {s.shelter}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  )}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>
          </div>
        </div>
        <div id="date-section" className="flex flex-col gap-1.5">
          <Label htmlFor="dateAndTime">Jadwal</Label>
          <DatePicker
            id="dateAndTime"
            hourCycle={24}
            aria-label="date"
            granularity="minute"
            shouldForceLeadingZeros
            shouldCloseOnSelect={false}
            value={dt}
            onChange={setDt}
            hideTimeZone
          >
            {({ state }) => (
              <>
                <DateField.Group fullWidth>
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover className="flex flex-col gap-3">
                  <Calendar aria-label="Event date">
                    <Calendar.Header>
                      <Calendar.YearPickerTrigger>
                        <Calendar.YearPickerTriggerHeading />
                        <Calendar.YearPickerTriggerIndicator />
                      </Calendar.YearPickerTrigger>
                      <Calendar.NavButton slot="previous" />
                      <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => (
                          <Calendar.HeaderCell>{day}</Calendar.HeaderCell>
                        )}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                    <Calendar.YearPickerGrid>
                      <Calendar.YearPickerGridBody>
                        {({ year }) => <Calendar.YearPickerCell year={year} />}
                      </Calendar.YearPickerGridBody>
                    </Calendar.YearPickerGrid>
                  </Calendar>
                  <div className="flex items-center justify-between">
                    <Label>Waktu di tujuan:</Label>
                    <TimeField
                      value={state.timeValue}
                      onChange={(newValue) => {
                        if (newValue) {
                          state.setTimeValue(newValue as any);
                        }
                      }}
                      aria-label="Time"
                      granularity="minute"
                      hideTimeZone
                      hourCycle={24}
                      name="time"
                      shouldForceLeadingZeros
                    >
                      <TimeField.Group variant="secondary">
                        <TimeField.Input>
                          {(segment) => <TimeField.Segment segment={segment} />}
                        </TimeField.Input>
                      </TimeField.Group>
                    </TimeField>
                  </div>
                </DatePicker.Popover>
              </>
            )}
          </DatePicker>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 py-2 text-white mt-6 hover:cursor-pointer hover:bg-blue-500"
        >
          Periksa Waktu
        </button>
      </form>
    </section>
  );
}

<script setup>
import { ArrowDownTrayIcon } from '@heroicons/vue/24/solid';
import { LinkIcon, PrinterIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div>
    <div class="flex items-center gap-1 mb-4">
      <LinkIcon class="w-5 h-5 text-slate-600" />
      <p class="text-sm font-medium">Cody_Fisher_Resume.pdf</p>
    </div>

    <div class="p-4 bg-slate-200 max-lg:p-2 max-sm:p-1">
      <div class="bg-white shadow-md pt-2 pr-2 pl-6 pb-6 max-lg:pl-3">
        <header class="flex justify-end mb-2">
          <div class="flex gap-1 rounded-sm">
            <div class="border border-slate-400 w-fit p-1">
              <PrinterIcon class="w-5 h-5 text-gray-700" />
            </div>
            <div class="border border-slate-400 w-fit p-1 rounded-sm">
              <ArrowDownTrayIcon class="w-5 h-5 text-gray-700" />
            </div>
          </div>
        </header>

        <div>
          <div>
            <div class="flex justify-between items-center">
              <p class="text-base font-semibold">Cody Fisher</p>
              <span class="text-xs text-cyan-600 font-medium"
                >example@email.com</span
              >
            </div>
            <p class="text-sm">
              UI/UX Designer with Human Centered Design Approach
            </p>
          </div>

          <div class="mt-3">
            <h3 class="font-medium text-sm">Profile</h3>
            <p class="text-xs text-gray-700 font-medium">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi
              nihil quam id? Possimus, repellendus illo necessitatibus assumenda
              adipisci delectus totam Animi nihil quam id? Possimus, repellendus
              illo necessitatibus assumenda adipisci delectus totam
            </p>
          </div>

          <div class="mt-4 border-b border-b-slate-200 pb-3">
            <h3 class="font-medium text-sm mb-1">Experience</h3>
            <p class="text-xs font-medium text-gray-700">Marketing Manager</p>
            <div class="flex justify-between mb-2">
              <p class="text-xs text-gray-500">San Francisco USA</p>
              <p class="text-xs text-gray-500">Feb 2017 - currently employed</p>
            </div>
            <ul class="text-xs list-disc ml-4">
              <li>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus
                aspernatur voluptatem placeat error sapiente voluptatum?
              </li>
              <li>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus
                aspernatur voluptatem placeat error
              </li>
              <li>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus
                aspernatur voluptatem placeat error sapiente voluptatum? Natus
                aspernatur voluptatem placeat error sapiente voluptatum?
              </li>
              <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
            </ul>
          </div>

          <div class="mt-4">
            <h3 class="font-medium text-sm mb-1">Analyst</h3>
            <p class="text-xs font-medium text-gray-700">Marketing Manager</p>
            <div class="flex justify-between mb-2">
              <p class="text-xs text-gray-500">San Francisco USA</p>
              <p class="text-xs text-gray-500">Feb 2017 - currently employed</p>
            </div>
            <ul class="text-xs list-disc ml-4">
              <li>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus
                aspernatur voluptatem placeat error sapiente voluptatum?
              </li>
              <li>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus
                aspernatur voluptatem placeat error
              </li>
              <li>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Natus
                aspernatur voluptatem placeat error sapiente voluptatum? Natus
                aspernatur voluptatem placeat error sapiente voluptatum?
              </li>
              <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</li>
            </ul>
          </div>

          <div class="mt-4">
            <h3 class="font-medium text-sm mb-1">Education</h3>
            <p class="text-xs font-medium text-gray-700">
              MSc. Stratgic Marketing
            </p>
            <div class="flex justify-between mb-2">
              <p class="text-xs text-gray-500">Liberty school of management</p>
              <p class="text-xs text-gray-500">Feb 2017 - Sept 2017</p>
            </div>
            <ul class="text-xs list-disc ml-4">
              <li>Graduate with education</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
